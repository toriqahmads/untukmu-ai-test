import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { PurchaseService } from './purchase.service';
import { PurchaseEntity } from 'src/entities/purchase.entity';
import { PurchaseMapper } from './mapper/purchase.mapper';
import { UserService } from '../users/user.service';
import { CreatePurchaseDto } from './dto/create.purchase.dto';
import { IPurchaseEntity } from './interface/purchase.entity.interface';
import { IUserEntity } from '../users/interface/user.entity.interface';
import { UserEntity } from 'src/entities/user.entity';
import { UpdatePurchaseDto } from './dto/update.purchase.dto';

describe('PurchaseService', () => {
  let service: PurchaseService;

  const mockRepository = {
    save: jest.fn(),
    findOne: jest.fn(),
    find: jest.fn(),
  };

  const mockMapper = {
    toCreatePayload: jest.fn(),
    toUpdatePayload: jest.fn(),
    toFindAllPayload: jest.fn(),
    toFindOne: jest.fn(),
  };

  const mockUserService = {
    findById: jest.fn(),
    findReferrer: jest.fn(),
    updateEarning: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PurchaseService,
        {
          provide: getRepositoryToken(PurchaseEntity),
          useValue: mockRepository,
        },
        {
          provide: PurchaseMapper,
          useValue: mockMapper,
        },
        {
          provide: UserService,
          useValue: mockUserService,
        },
      ],
    }).compile();

    service = module.get<PurchaseService>(PurchaseService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a purchase and process referral earnings', async () => {
      const _createPurchaseDto: CreatePurchaseDto = {
        amount: 100,
        userId: 1,
        context: {
          user: { userId: 1 },
          params: undefined,
          query: undefined,
        },
      };
      const createPurchaseDto = new CreatePurchaseDto();
      Object.assign(createPurchaseDto, _createPurchaseDto);

      const purchaseEntity: IPurchaseEntity = {
        purchaseId: 1,
        ...createPurchaseDto,
        user: {
          userId: 1,
          username: 'test',
        },
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      const savedEntity = new PurchaseEntity();
      Object.assign(savedEntity, purchaseEntity);

      mockMapper.toCreatePayload.mockReturnValue(createPurchaseDto);
      mockRepository.save.mockResolvedValue(savedEntity);

      jest.spyOn(service, 'processReferralEarning').mockResolvedValue();

      const result = await service.create(createPurchaseDto);

      expect(result).toEqual(savedEntity);
      expect(mockMapper.toCreatePayload).toHaveBeenCalledWith(
        createPurchaseDto,
      );
      expect(mockRepository.save).toHaveBeenCalledWith(createPurchaseDto);
      expect(service.processReferralEarning).toHaveBeenCalledWith(1, 100, 1);
    });

    it('should handle errors during creation', async () => {
      const _createPurchaseDto: CreatePurchaseDto = {
        amount: 100,
        userId: 1,
        context: {
          user: { userId: 1 },
          params: undefined,
          query: undefined,
        },
      };

      const createPurchaseDto = new CreatePurchaseDto();
      Object.assign(createPurchaseDto, _createPurchaseDto);

      const mockDatabaseError = 'Database error';

      mockMapper.toCreatePayload.mockReturnValue(createPurchaseDto);
      mockRepository.save.mockRejectedValue(new Error(mockDatabaseError));

      await expect(service.create(createPurchaseDto)).rejects.toThrow(
        mockDatabaseError,
      );
    });
  });

  describe('processReferralEarning', () => {
    it('should process referral earnings for two levels', async () => {
      const userEntity: IUserEntity = {
        userId: 1,
        password: 'hashedpassword',
        earnings: 0,
        referrer: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
        referralCode: 'TES123',
        username: 'test',
      };

      const user1 = new UserEntity();
      Object.assign(user1, userEntity);

      const user2 = new UserEntity();
      Object.assign(user2, {
        ...userEntity,
        userId: 2,
        referrer: 3,
        earnings: 0,
      });

      const user3 = new UserEntity();
      Object.assign(user3, {
        ...userEntity,
        userId: 3,
        referrer: null,
        earnings: 0,
      });

      mockUserService.updateEarning.mockClear();
      mockUserService.findById.mockResolvedValueOnce(user1);
      mockUserService.findReferrer.mockResolvedValueOnce(user2);
      mockUserService.findById.mockResolvedValueOnce(user2);
      mockUserService.findReferrer.mockResolvedValueOnce(user3);

      await service.processReferralEarning(user1.userId, 100);

      expect(mockUserService.updateEarning).toHaveBeenCalledWith(
        user2.userId,
        10,
      );
      expect(mockUserService.updateEarning).toHaveBeenCalledWith(
        user3.userId,
        5,
      );
    });

    it('should stop processing after two levels', async () => {
      const userEntity: IUserEntity = {
        userId: 1,
        password: 'hashedpassword',
        earnings: 0,
        referrer: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
        referralCode: 'TES123',
        username: 'test',
      };

      const user1 = new UserEntity();
      Object.assign(user1, userEntity);

      const user2 = new UserEntity();
      Object.assign(user2, {
        ...userEntity,
        userId: 2,
        referrer: 3,
        earnings: 0,
      });

      const user3 = new UserEntity();
      Object.assign(user3, {
        ...userEntity,
        userId: 3,
        referrer: 4,
        earnings: 0,
      });

      mockUserService.findById.mockResolvedValueOnce(user1);
      mockUserService.findReferrer.mockResolvedValueOnce(user2);
      mockUserService.findById.mockResolvedValueOnce(user2);
      mockUserService.findReferrer.mockResolvedValueOnce(user3);

      await service.processReferralEarning(1, 100);

      expect(mockUserService.updateEarning).toHaveBeenCalledTimes(2);
      expect(mockUserService.updateEarning).toHaveBeenCalledWith(
        user2.userId,
        10,
      );
      expect(mockUserService.updateEarning).toHaveBeenCalledWith(
        user3.userId,
        5,
      );
    });

    it('should handle users without referrers', async () => {
      const userEntity: IUserEntity = {
        userId: 1,
        password: 'hashedpassword',
        earnings: 0,
        referrer: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        referralCode: 'TES123',
        username: 'test',
      };

      const user = new UserEntity();
      Object.assign(user, userEntity);

      mockUserService.findById.mockResolvedValueOnce(user);

      await service.processReferralEarning(1, 100);

      expect(mockUserService.updateEarning).not.toHaveBeenCalled();
    });

    it('should handle users with referrer but referrer not found', async () => {
      const userEntity: IUserEntity = {
        userId: 1,
        password: 'hashedpassword',
        earnings: 0,
        referrer: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
        referralCode: 'TES123',
        username: 'test',
      };

      const user1 = new UserEntity();
      Object.assign(user1, userEntity);

      mockUserService.findById.mockResolvedValueOnce(user1);
      mockUserService.findReferrer.mockResolvedValueOnce(null);

      await service.processReferralEarning(1, 100);

      expect(mockUserService.updateEarning).not.toHaveBeenCalled();
    });

    it('should handle errors during processing', async () => {
      const mockDatabaseError = 'Database error';
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const _updatePurchaseDto = new UpdatePurchaseDto();
      mockUserService.findById.mockRejectedValue(new Error(mockDatabaseError));

      await expect(service.processReferralEarning(1, 100)).rejects.toThrow(
        mockDatabaseError,
      );
    });
  });
});
