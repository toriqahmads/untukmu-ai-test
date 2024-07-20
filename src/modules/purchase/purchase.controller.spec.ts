import { Test, TestingModule } from '@nestjs/testing';
import { PurchaseController } from './purchase.controller';
import { PurchaseService } from './purchase.service';
import { CreatePurchaseDto } from './dto/create.purchase.dto';
import { FindAllPurchaseDto } from './dto/findall.purchase.dto';
import { JwtAuthGuard } from 'src/guards/jwt.guard';
import { IPurchaseEntity } from './interface/purchase.entity.interface';
import { PurchaseEntity } from 'src/entities/purchase.entity';
import { paginate } from 'src/helpers/pagination.helper';

describe('PurchaseController', () => {
  let controller: PurchaseController;
  let service: PurchaseService;

  const mockPurchaseService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findById: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PurchaseController],
      providers: [
        {
          provide: PurchaseService,
          useValue: mockPurchaseService,
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<PurchaseController>(PurchaseController);
    service = module.get<PurchaseService>(PurchaseService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a purchase', async () => {
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
        amount: 100,
        userId: 1,
        user: {
          userId: 1,
          username: 'test',
        },
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const expectedResult = new PurchaseEntity();
      Object.assign(expectedResult, purchaseEntity);

      jest.spyOn(service, 'create').mockResolvedValue(expectedResult);

      const result = await controller.create(createPurchaseDto);

      expect(result).toBe(expectedResult);
      expect(service.create).toHaveBeenCalledWith(createPurchaseDto);
      expect(createPurchaseDto.userId).toBe(purchaseEntity.userId);
    });
  });

  describe('findAll', () => {
    it('should return an array of purchases', async () => {
      const _findAllPurchaseDto: FindAllPurchaseDto = { page: 1, limit: 10 };
      const findAllPurchaseDto = new FindAllPurchaseDto();
      Object.assign(FindAllPurchaseDto, _findAllPurchaseDto);

      const purchaseId = 1;
      const _purchaseEntity: IPurchaseEntity = {
        purchaseId,
        amount: 100,
        userId: 1,
        user: {
          userId: 1,
          username: 'test',
        },
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const purchaseEntity1 = new PurchaseEntity();
      Object.assign(purchaseEntity1, _purchaseEntity);

      const purchaseEntity2 = new PurchaseEntity();
      Object.assign(purchaseEntity2, { ..._purchaseEntity, amount: 200 });

      const purchaseEntities = [purchaseEntity1, purchaseEntity2];
      const expectedResult = paginate(
        purchaseEntities,
        purchaseEntities.length,
        findAllPurchaseDto.page,
        findAllPurchaseDto.limit,
      );

      jest.spyOn(service, 'findAll').mockResolvedValue(expectedResult);

      const result = await controller.findAll(findAllPurchaseDto);

      expect(result).toBe(expectedResult);
      expect(service.findAll).toHaveBeenCalledWith(findAllPurchaseDto);
    });
  });

  describe('findOne', () => {
    it('should return a purchase by id', async () => {
      const purchaseId = 1;
      const purchaseEntity: IPurchaseEntity = {
        purchaseId,
        amount: 100,
        userId: 1,
        user: {
          userId: 1,
          username: 'test',
        },
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const expectedResult = new PurchaseEntity();
      Object.assign(expectedResult, purchaseEntity);

      jest.spyOn(service, 'findById').mockResolvedValue(expectedResult);

      const result = await controller.findOne(purchaseId);

      expect(result).toBe(expectedResult);
      expect(service.findById).toHaveBeenCalledWith(purchaseId);
    });
  });
});
