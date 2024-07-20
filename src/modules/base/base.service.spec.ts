import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken, InjectRepository } from '@nestjs/typeorm';
import {
  Repository,
  DeepPartial,
  FindManyOptions,
  FindOneOptions,
} from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { Injectable, NotFoundException } from '@nestjs/common';
import { BaseService } from './base.service';
import { BaseFindAllDto } from './dto/base.findall.dto';
import { IPagination } from 'src/interfaces/pagination.interface';
import { IMapper } from 'src/interfaces/mapper.interface';
import { paginate } from 'src/helpers/pagination.helper';

// Mock Entity
class TestEntity {
  id: number;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

// Mock DTOs
class CreateTestDto {
  name: string;
}

class UpdateTestDto {
  name?: string;
}

// Mock Mapper
class TestMapper
  implements
    IMapper<
      TestEntity,
      CreateTestDto,
      UpdateTestDto,
      BaseFindAllDto,
      DeepPartial<TestEntity>,
      DeepPartial<TestEntity>,
      FindManyOptions<TestEntity>,
      FindOneOptions<TestEntity>
    >
{
  toCreatePayload(createDto: CreateTestDto): DeepPartial<TestEntity> {
    return { ...createDto };
  }

  toUpdatePayload(updateDto: UpdateTestDto): DeepPartial<TestEntity> {
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

  toPaginate(
    entities: TestEntity[],
    total_data: number,
    page: number,
    limit: number,
  ): IPagination<TestEntity> {
    return paginate(entities, total_data, page, limit);
  }
}

@Injectable()
class TestService extends BaseService<
  TestEntity,
  CreateTestDto,
  UpdateTestDto
> {
  constructor(
    @InjectRepository(TestEntity)
    repository: Repository<TestEntity>,
    mapper: TestMapper,
  ) {
    super(repository, mapper);
  }
}

describe('BaseService', () => {
  let testService: TestService;
  let repository: Repository<TestEntity>;
  let mapper: TestMapper;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TestMapper,
        TestService,
        {
          provide: getRepositoryToken(TestEntity),
          useClass: Repository,
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn().mockReturnValue('mock_token'),
          },
        },
      ],
    }).compile();

    testService = module.get<TestService>(TestService);
    repository = module.get<Repository<TestEntity>>(
      getRepositoryToken(TestEntity),
    );
    mapper = module.get<TestMapper>(TestMapper);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(testService).toBeDefined();
  });

  describe('create', () => {
    it('should create a new entity', async () => {
      const createDto: CreateTestDto = { name: 'Test Entity' };
      const createdEntity: TestEntity = {
        id: 1,
        ...createDto,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      jest.spyOn(mapper, 'toCreatePayload').mockReturnValue(createDto);
      jest.spyOn(repository, 'save').mockResolvedValue(createdEntity);

      const result = await testService.create(createDto);
      expect(result).toEqual(createdEntity);
    });

    it('should throw an error if creation fails', async () => {
      const createDto: CreateTestDto = { name: 'Test Entity' };

      jest.spyOn(mapper, 'toCreatePayload').mockReturnValue(createDto);
      jest
        .spyOn(repository, 'save')
        .mockRejectedValue(new Error('Database error'));

      await expect(testService.create(createDto)).rejects.toThrow(
        'Database error',
      );
    });
  });

  describe('findAll', () => {
    it('should return paginated entities', async () => {
      const findAllDto: BaseFindAllDto = { page: 1, limit: 10 };
      const entities: TestEntity[] = [
        {
          id: 1,
          name: 'Entity 1',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 2,
          name: 'Entity 2',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];
      const findManyOptions: FindManyOptions<TestEntity> = {
        skip: 0,
        take: 10,
      };

      const mockPaginateResult = paginate(
        entities,
        entities.length,
        findAllDto.page,
        findAllDto.limit,
      );

      jest.spyOn(mapper, 'toFindAllPayload').mockReturnValue(findManyOptions);
      jest.spyOn(repository, 'findAndCount').mockResolvedValue([entities, 2]);
      jest.spyOn(mapper, 'toPaginate').mockReturnValue(mockPaginateResult);

      const result = await testService.findAll(findAllDto);
      expect(result.list).toEqual(entities);
      expect(result.pagination.total_data).toBe(2);
    });

    it('should handle empty result', async () => {
      const findAllDto: BaseFindAllDto = { page: 1, limit: 10 };
      const findManyOptions: FindManyOptions<TestEntity> = {
        skip: 0,
        take: 10,
      };

      const mockPaginateResult = paginate(
        [],
        0,
        findAllDto.page,
        findAllDto.limit,
      );

      jest.spyOn(mapper, 'toFindAllPayload').mockReturnValue(findManyOptions);
      jest.spyOn(repository, 'findAndCount').mockResolvedValue([[], 0]);
      jest.spyOn(mapper, 'toPaginate').mockReturnValue(mockPaginateResult);

      const result = await testService.findAll(findAllDto);
      expect(result.list).toEqual([]);
      expect(result.pagination.total_data).toBe(0);
    });

    it('should throw an error if findAll fails', async () => {
      const findAllDto: BaseFindAllDto = { page: 1, limit: 10 };
      const findManyOptions: FindManyOptions<TestEntity> = {
        skip: 0,
        take: 10,
      };

      jest.spyOn(mapper, 'toFindAllPayload').mockReturnValue(findManyOptions);
      jest
        .spyOn(repository, 'findAndCount')
        .mockRejectedValue(new Error('Database error'));

      await expect(testService.findAll(findAllDto)).rejects.toThrow(
        'Database error',
      );
    });
  });

  describe('findById', () => {
    it('should return an entity by id', async () => {
      const entity: TestEntity = {
        id: 1,
        name: 'Test Entity',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      const findOneOptions: FindOneOptions<TestEntity> = { where: { id: 1 } };

      jest.spyOn(mapper, 'toFindOne').mockReturnValue(findOneOptions);
      jest.spyOn(repository, 'findOne').mockResolvedValue(entity);

      const result = await testService.findById(1);
      expect(result).toEqual(entity);
    });

    it('should throw NotFoundException if entity not found', async () => {
      const findOneOptions: FindOneOptions<TestEntity> = { where: { id: 1 } };

      jest.spyOn(mapper, 'toFindOne').mockReturnValue(findOneOptions);
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);

      await expect(testService.findById(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('updateById', () => {
    it('should update an entity', async () => {
      const updateDto: UpdateTestDto = { name: 'Updated Entity' };
      const existingEntity: TestEntity = {
        id: 1,
        name: 'Test Entity',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      const updatedEntity: TestEntity = {
        ...existingEntity,
        ...updateDto,
        updatedAt: new Date(),
      };
      const findOneOptions: FindOneOptions<TestEntity> = { where: { id: 1 } };

      jest.spyOn(mapper, 'toFindOne').mockReturnValue(findOneOptions);
      jest.spyOn(repository, 'findOne').mockResolvedValueOnce(existingEntity);
      jest.spyOn(mapper, 'toUpdatePayload').mockReturnValue(updateDto);
      jest
        .spyOn(repository, 'update')
        .mockResolvedValue({ affected: 1, generatedMaps: [], raw: {} });
      jest.spyOn(repository, 'findOne').mockResolvedValueOnce(updatedEntity);

      const result = await testService.updateById(1, updateDto);
      expect(result).toEqual(updatedEntity);
    });

    it('should throw NotFoundException if entity not found for update', async () => {
      const updateDto: UpdateTestDto = { name: 'Updated Entity' };
      const findOneOptions: FindOneOptions<TestEntity> = { where: { id: 1 } };

      jest.spyOn(mapper, 'toFindOne').mockReturnValue(findOneOptions);
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);

      await expect(testService.updateById(1, updateDto)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('removeById', () => {
    it('should soft delete an entity', async () => {
      const existingEntity: TestEntity = {
        id: 1,
        name: 'Test Entity',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      const findOneOptions: FindOneOptions<TestEntity> = { where: { id: 1 } };

      jest.spyOn(mapper, 'toFindOne').mockReturnValue(findOneOptions);
      jest.spyOn(repository, 'findOne').mockResolvedValue(existingEntity);
      jest
        .spyOn(repository, 'softDelete')
        .mockResolvedValue({ affected: 1, generatedMaps: [], raw: {} });

      const result = await testService.removeById(1);
      expect(result).toEqual(existingEntity);
    });

    it('should throw NotFoundException if entity not found for removal', async () => {
      const findOneOptions: FindOneOptions<TestEntity> = { where: { id: 1 } };

      jest.spyOn(mapper, 'toFindOne').mockReturnValue(findOneOptions);
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);

      await expect(testService.removeById(1)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
