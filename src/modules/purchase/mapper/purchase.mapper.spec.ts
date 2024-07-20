import { PurchaseMapper } from './purchase.mapper';
import { CreatePurchaseDto } from '../dto/create.purchase.dto';
import { UpdatePurchaseDto } from '../dto/update.purchase.dto';
import { FindAllPurchaseDto } from '../dto/findall.purchase.dto';
import { PurchaseEntity } from 'src/entities/purchase.entity';
import { Between, LessThanOrEqual, MoreThanOrEqual } from 'typeorm';

describe('PurchaseMapper', () => {
  let purchaseMapper: PurchaseMapper;

  beforeEach(() => {
    purchaseMapper = new PurchaseMapper();
  });

  describe('toCreatePayload', () => {
    it('should map CreatePurchaseDto to PurchaseEntity', () => {
      const _createPurchaseDto: CreatePurchaseDto = {
        amount: 100,
        userId: 1,
      };
      const createPurchaseDto = new CreatePurchaseDto();
      Object.assign(createPurchaseDto, _createPurchaseDto);

      const result = purchaseMapper.toCreatePayload(createPurchaseDto);

      expect(result).toBeInstanceOf(PurchaseEntity);
      expect(result.amount).toBe(createPurchaseDto.amount);
      expect(result.userId).toBe(createPurchaseDto.userId);
    });
  });

  describe('toUpdatePayload', () => {
    it('should map UpdatePurchaseDto to partial PurchaseEntity', () => {
      const _updatePurchaseDto: UpdatePurchaseDto = {
        purchaseId: 1,
        amount: 200,
      };
      const updatePurchaseDto = new UpdatePurchaseDto();
      Object.assign(updatePurchaseDto, _updatePurchaseDto);

      const result = purchaseMapper.toUpdatePayload(updatePurchaseDto);

      expect(result).toBeInstanceOf(PurchaseEntity);
    });
  });

  describe('toFindAllPayload', () => {
    it('should use default values when page and limit are not provided', () => {
      const findAllPurchaseDto: FindAllPurchaseDto = new FindAllPurchaseDto();

      const result = purchaseMapper.toFindAllPayload(findAllPurchaseDto);

      expect(result.skip).toBe(0);
      expect(result.take).toBe(25);
    });

    it('should create FindManyOptions from FindAllPurchaseDto', () => {
      const _findAllPurchaseDto: FindAllPurchaseDto = {
        page: 2,
        limit: 10,
        startRangeAmount: 10,
        endRangeAmount: 100,
        userId: 1,
      };

      const findAllPurchaseDto = new FindAllPurchaseDto();
      Object.assign(findAllPurchaseDto, _findAllPurchaseDto);

      const result = purchaseMapper.toFindAllPayload(findAllPurchaseDto);

      const expectWhere = {
        userId: findAllPurchaseDto.userId,
        amount: Between(
          findAllPurchaseDto.startRangeAmount,
          findAllPurchaseDto.endRangeAmount,
        ),
      };

      expect(result.skip).toBe(10);
      expect(result.take).toBe(10);
      expect(result.where).toEqual(expectWhere);
    });

    it('should include only startRangeAmount when endRangeAmount is not provided', () => {
      const _findAllPurchaseDto: FindAllPurchaseDto = {
        startRangeAmount: 10,
      };

      const findAllPurchaseDto = new FindAllPurchaseDto();
      Object.assign(findAllPurchaseDto, _findAllPurchaseDto);

      const result = purchaseMapper.toFindAllPayload(findAllPurchaseDto);

      const expectWhere = {
        amount: MoreThanOrEqual(Number(findAllPurchaseDto.startRangeAmount)),
      };

      expect(result.where).toEqual(expectWhere);
    });

    it('should include only endRangeAmount when startRangeAmount is not provided', () => {
      const _findAllPurchaseDto: FindAllPurchaseDto = {
        endRangeAmount: 10,
      };

      const findAllPurchaseDto = new FindAllPurchaseDto();
      Object.assign(findAllPurchaseDto, _findAllPurchaseDto);

      const result = purchaseMapper.toFindAllPayload(findAllPurchaseDto);

      const expectWhere = {
        amount: LessThanOrEqual(Number(findAllPurchaseDto.endRangeAmount)),
      };

      expect(result.where).toEqual(expectWhere);
    });
  });

  describe('toFindOne', () => {
    it('should create FindOneOptions<PurchaseEntity> with correct id and relations', () => {
      const id = 1;

      const result = purchaseMapper.toFindOne(id);

      expect(result.where).toEqual({ purchaseId: id });
      expect(result.relations).toEqual({ user: true });
      expect(result.relationLoadStrategy).toBe('join');
    });
  });
});
