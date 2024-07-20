import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserService } from './user.service';
import { UserEntity } from 'src/entities/user.entity';
import { UserMapper } from './mapper/user.mapper';
import { CreateUserDto } from './dto/create.user.dto';
import { IUserEntity } from './interface/user.entity.interface';

describe('UserService', () => {
  let service: UserService;

  const mockRepository = {
    save: jest.fn(),
    update: jest.fn(),
    findOne: jest.fn(),
    exists: jest.fn(),
  };

  const mockMapper = {
    toCreatePayload: jest.fn(),
    toFindOneByUsername: jest.fn(),
    toFindOneByReferralCode: jest.fn(),
    toFindOneReferrer: jest.fn(),
    toCheckUsernameExist: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(UserEntity),
          useValue: mockRepository,
        },
        {
          provide: UserMapper,
          useValue: mockMapper,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a user without referral', async () => {
      const _createUserDto: CreateUserDto = {
        username: 'testuser',
        password: 'password123',
      };

      const createUserDto = new CreateUserDto();
      Object.assign(createUserDto, _createUserDto);

      const mappedPayload = {
        username: 'testuser',
        password: 'password',
      };

      const savedEntity: IUserEntity = {
        ...mappedPayload,
        userId: 1,
        password: 'hashedpassword',
        earnings: 0,
        referrer: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        referralCode: 'TES123',
      };

      mockMapper.toCreatePayload.mockReturnValue(mappedPayload);
      mockRepository.save.mockResolvedValue(savedEntity);

      const result = await service.create(createUserDto);

      expect(mockMapper.toCreatePayload).toHaveBeenCalledWith(createUserDto);
      expect(mockRepository.save).toHaveBeenCalledWith(mappedPayload);
      expect(result).toEqual(savedEntity);
    });

    it('should create a user with referral', async () => {
      const _createUserDto: CreateUserDto = {
        username: 'testuser',
        password: 'password123',
        referralCode: 'TEST123',
      };

      const createUserDto = new CreateUserDto();
      Object.assign(createUserDto, _createUserDto);

      const mappedPayload = {
        username: 'testuser',
      };

      const referrer: IUserEntity = {
        userId: 1,
        username: 'referrer',
        earnings: 0,
        referrer: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        referralCode: 'TES123',
        password: 'hashedpassword',
      };

      const savedEntity: IUserEntity = {
        ...mappedPayload,
        userId: 2,
        password: 'hashedpassword',
        referrer: referrer.userId,
        earnings: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
        referralCode: 'TES234',
      };

      mockMapper.toCreatePayload.mockReturnValue(mappedPayload);
      mockMapper.toFindOneByReferralCode.mockReturnValue({
        where: { referralCode: createUserDto.referralCode },
      });
      mockRepository.findOne.mockResolvedValue(referrer);
      mockRepository.save.mockResolvedValue(savedEntity);

      const result = await service.create(createUserDto);

      expect(mockMapper.toCreatePayload).toHaveBeenCalledWith(createUserDto);
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { referralCode: createUserDto.referralCode },
      });
      expect(mockRepository.save).toHaveBeenCalledWith({
        ...mappedPayload,
        referrer: referrer.userId,
      });
      expect(result).toEqual(savedEntity);
    });

    it('should throw an error if creation fails', async () => {
      const mockDatabaseError = 'Database error';
      const _createUserDto: CreateUserDto = {
        username: 'testuser',
        password: 'password123',
        referralCode: 'TEST123',
      };

      const createUserDto = new CreateUserDto();
      Object.assign(createUserDto, _createUserDto);

      mockMapper.toCreatePayload.mockReturnValue(_createUserDto);
      mockRepository.save.mockRejectedValue(new Error(mockDatabaseError));

      await expect(service.create(createUserDto)).rejects.toThrow(
        mockDatabaseError,
      );
    });
  });

  describe('updateEarning', () => {
    it('should update user earnings successfully', async () => {
      const userId = 1;
      const earnings = 100;
      mockRepository.update.mockResolvedValue({ affected: 1 });

      const result = await service.updateEarning(userId, earnings);

      expect(mockRepository.update).toHaveBeenCalledWith(userId, { earnings });
      expect(result).toBe(true);
    });

    it('should return false if no user was updated', async () => {
      const userId = 1;
      const earnings = 100;
      mockRepository.update.mockResolvedValue({ affected: 0 });

      const result = await service.updateEarning(userId, earnings);

      expect(mockRepository.update).toHaveBeenCalledWith(userId, { earnings });
      expect(result).toBe(false);
    });

    it('should throw an error if update fails', async () => {
      const mockDatabaseError = 'Database error';
      const userId = 1;
      const earnings = 100;
      mockRepository.update.mockRejectedValue(new Error(mockDatabaseError));

      await expect(service.updateEarning(userId, earnings)).rejects.toThrow(
        mockDatabaseError,
      );
    });
  });

  describe('findByUsername', () => {
    it('should find a user by username', async () => {
      const username = 'testuser';
      const user: IUserEntity = {
        userId: 1,
        username: 'testuser',
        password: 'hashedpassword',
        referrer: null,
        earnings: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
        referralCode: 'TES123',
      };

      mockMapper.toFindOneByUsername.mockReturnValue({ where: { username } });
      mockRepository.findOne.mockResolvedValue(user);

      const result = await service.findByUsername(username);

      expect(mockMapper.toFindOneByUsername).toHaveBeenCalledWith(username);
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { username },
      });
      expect(result).toEqual(user);
    });

    it('should return null if user is not found', async () => {
      const username = 'noexist';
      mockMapper.toFindOneByUsername.mockReturnValue({ where: { username } });
      mockRepository.findOne.mockResolvedValue(null);

      const result = await service.findByUsername(username);

      expect(result).toBeNull();
    });

    it('should throw an error if findOne fails', async () => {
      const username = 'testuser';
      const mockDatabaseError = 'Database error';
      mockMapper.toFindOneByUsername.mockReturnValue({ where: { username } });
      mockRepository.findOne.mockRejectedValue(new Error(mockDatabaseError));

      await expect(service.findByUsername(username)).rejects.toThrow(
        mockDatabaseError,
      );
    });
  });

  describe('findByReferralCode', () => {
    it('should find a user by referral code', async () => {
      const referralCode = 'TES123';
      const user: IUserEntity = {
        userId: 1,
        username: 'testuser',
        password: 'hashedpassword',
        referrer: null,
        earnings: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
        referralCode,
      };

      mockMapper.toFindOneByReferralCode.mockReturnValue({
        where: { referralCode },
      });

      mockRepository.findOne.mockResolvedValue(user);

      const result = await service.findByReferralCode(referralCode);

      expect(mockMapper.toFindOneByReferralCode).toHaveBeenCalledWith(
        referralCode,
      );
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { referralCode },
      });
      expect(result).toEqual(user);
    });

    it('should return null if user is not found', async () => {
      const referralCode = 'noexist';

      mockMapper.toFindOneByReferralCode.mockReturnValue({
        where: { referralCode },
      });
      mockRepository.findOne.mockResolvedValue(null);

      const result = await service.findByReferralCode(referralCode);

      expect(result).toBeNull();
    });

    it('should throw an error if findOne fails', async () => {
      const referralCode = 'TES123';
      const mockDatabaseError = 'Database error';

      mockMapper.toFindOneByReferralCode.mockReturnValue({
        where: { referralCode },
      });
      mockRepository.findOne.mockRejectedValue(new Error(mockDatabaseError));

      await expect(service.findByReferralCode(referralCode)).rejects.toThrow(
        mockDatabaseError,
      );
    });
  });

  describe('findReferrer', () => {
    it('should find a referrer by id', async () => {
      const referrerId = 1;
      const user: IUserEntity = {
        userId: 1,
        username: 'testuser',
        password: 'hashedpassword',
        referrer: null,
        earnings: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
        referralCode: 'TES123',
      };

      mockMapper.toFindOneReferrer.mockReturnValue({
        where: { userId: referrerId },
      });
      mockRepository.findOne.mockResolvedValue(user);

      const result = await service.findReferrer(referrerId);

      expect(mockMapper.toFindOneReferrer).toHaveBeenCalledWith(referrerId);
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { userId: referrerId },
      });
      expect(result).toEqual(user);
    });

    it('should return null if referrer is not found', async () => {
      const referrerId = 0;

      mockMapper.toFindOneReferrer.mockReturnValue({
        where: { userId: referrerId },
      });
      mockRepository.findOne.mockResolvedValue(null);

      const result = await service.findReferrer(referrerId);

      expect(result).toBeNull();
    });

    it('should throw an error if findOne fails', async () => {
      const referrerId = 3;
      const mockDatabaseError = 'Database error';

      mockMapper.toFindOneReferrer.mockReturnValue({
        where: { userId: referrerId },
      });
      mockRepository.findOne.mockRejectedValue(new Error(mockDatabaseError));

      await expect(service.findReferrer(referrerId)).rejects.toThrow(
        mockDatabaseError,
      );
    });
  });

  describe('isUsernameExist', () => {
    it('should return true if username exists', async () => {
      const username = 'user';
      mockMapper.toCheckUsernameExist.mockReturnValue({ where: { username } });
      mockRepository.exists.mockResolvedValue(true);

      const result = await service.isUsernameExist(username);

      expect(mockMapper.toCheckUsernameExist).toHaveBeenCalledWith(
        username,
        undefined,
      );
      expect(mockRepository.exists).toHaveBeenCalledWith({
        where: { username },
      });
      expect(result).toBe(true);
    });

    it('should return false if username does not exist', async () => {
      const username = 'newuser';
      mockMapper.toCheckUsernameExist.mockReturnValue({ where: { username } });
      mockRepository.exists.mockResolvedValue(false);

      const result = await service.isUsernameExist(username);

      expect(result).toBe(false);
    });

    it('should check username existence excluding a specific id', async () => {
      const username = 'user';
      const excludedId = 1;

      const mockWhere = {
        where: { username, userId: { $ne: excludedId } },
      };

      mockMapper.toCheckUsernameExist.mockReturnValue(mockWhere);
      mockRepository.exists.mockResolvedValue(false);

      const result = await service.isUsernameExist(username, excludedId);

      expect(mockMapper.toCheckUsernameExist).toHaveBeenCalledWith(
        username,
        excludedId,
      );
      expect(mockRepository.exists).toHaveBeenCalledWith(mockWhere);
      expect(result).toBe(false);
    });

    it('should throw an error if exists check fails', async () => {
      const username = 'user';
      const mockDatabaseError = 'Database error';

      mockMapper.toCheckUsernameExist.mockReturnValue({ where: { username } });
      mockRepository.exists.mockRejectedValue(new Error(mockDatabaseError));

      await expect(service.isUsernameExist(username)).rejects.toThrow(
        mockDatabaseError,
      );
    });
  });
});
