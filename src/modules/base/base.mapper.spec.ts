import { Test, TestingModule } from '@nestjs/testing';
import { BaseMapper } from './base.mapper';
import { BaseFindAllDto } from './dto/base.findall.dto';
import { DeepPartial, FindManyOptions, FindOneOptions } from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { paginate } from 'src/helpers/pagination.helper';
import { BaseUpdateDto } from './dto/base.update.dto';

class TestEntity {
  id: number;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

class CreateTestDto {
  name: string;
}

class UpdateTestDto extends BaseUpdateDto {
  name?: string;
}

class TestMapper extends BaseMapper<TestEntity, CreateTestDto, UpdateTestDto> {
  toCreatePayload(createDto: CreateTestDto): DeepPartial<TestEntity> {
    return { ...createDto };
  }

  toUpdatePayload(
    updateDto: UpdateTestDto,
  ): QueryDeepPartialEntity<TestEntity> {
    return { ...updateDto };
  }

  toFindAllPayload(findAllDto: BaseFindAllDto): FindManyOptions<TestEntity> {
    return {
      skip: (findAllDto.page - 1) * findAllDto.limit,
      take: findAllDto.limit,
    };
  }

  toFindOne(id: number): FindOneOptions<TestEntity> {
    return { where: { id } };
  }
}

describe('BaseMapper', () => {
  let testMapper: TestMapper;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TestMapper],
    }).compile();

    testMapper = module.get<TestMapper>(TestMapper);
  });

  describe('toCreatePayload', () => {
    it('should convert CreateTestDto to TestEntity', () => {
      const createDto: CreateTestDto = { name: 'Test Entity' };
      const result = testMapper.toCreatePayload(createDto);
      expect(result).toEqual(createDto);
    });
  });

  describe('toUpdatePayload', () => {
    it('should convert UpdateTestDto to partial TestEntity', () => {
      const _updateDto: UpdateTestDto = { name: 'Updated Test Entity' };
      const updateDto = new UpdateTestDto();
      Object.assign(updateDto, _updateDto);

      const result = testMapper.toUpdatePayload(updateDto);
      expect(result).toEqual(updateDto);
    });

    it('should handle partial updates', () => {
      const updateDto: UpdateTestDto = {};
      const result = testMapper.toUpdatePayload(updateDto);
      expect(result).toEqual({});
    });
  });

  describe('toFindAllPayload', () => {
    it('should convert BaseFindAllDto to FindManyOptions', () => {
      const findAllDto: BaseFindAllDto = { page: 2, limit: 10 };
      const result = testMapper.toFindAllPayload(findAllDto);
      expect(result).toEqual({ skip: 10, take: 10 });
    });

    it('should handle default pagination values', () => {
      const findAllDto: BaseFindAllDto = {};
      const result = testMapper.toFindAllPayload(findAllDto);
      expect(result).toEqual({ skip: NaN, take: undefined });
    });
  });

  describe('toFindOne', () => {
    it('should convert numeric id to FindOneOptions', () => {
      const id = 1;
      const result = testMapper.toFindOne(id);
      expect(result).toEqual({ where: { id } });
    });
  });

  describe('toPaginate', () => {
    it('should create IPagination object with provided values', () => {
      const entities: TestEntity[] = [
        { id: 1, name: 'Test 1', createdAt: new Date(), updatedAt: new Date() },
        { id: 2, name: 'Test 2', createdAt: new Date(), updatedAt: new Date() },
      ];
      const total_data = 10;
      const page = 1;
      const limit = 2;

      const expectedResult = paginate(entities, total_data, page, limit);
      const result = testMapper.toPaginate(entities, total_data, page, limit);

      expect(result).toEqual(expectedResult);
    });

    it('should handle last page scenario', () => {
      const entities: TestEntity[] = [
        {
          id: 9,
          name: 'Test 9',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 10,
          name: 'Test 10',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];
      const total_data = 10;
      const page = 5;
      const limit = 2;

      const expectedResult = paginate(entities, total_data, page, limit);
      const result = testMapper.toPaginate(entities, total_data, page, limit);

      expect(result).toEqual(expectedResult);
    });

    it('should handle empty result', () => {
      const entities: TestEntity[] = [];
      const total_data = 0;
      const page = 1;
      const limit = 10;

      const expectedResult = paginate(entities, entities.length, page, limit);
      const result = testMapper.toPaginate(entities, total_data, page, limit);

      expect(result).toEqual(expectedResult);
    });

    it('should use default values for page and limit if not provided', () => {
      const entities: TestEntity[] = [
        { id: 1, name: 'Test 1', createdAt: new Date(), updatedAt: new Date() },
      ];
      const total_data = 1;
      const page = undefined;
      const limit = undefined;

      const expectedResult = paginate(entities, entities.length, 1, 25);
      const result = testMapper.toPaginate(entities, total_data, page, limit);

      expect(result).toEqual(expectedResult);
    });
  });
});
