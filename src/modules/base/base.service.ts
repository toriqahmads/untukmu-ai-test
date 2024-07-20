import {
  DeepPartial,
  FindManyOptions,
  FindOneOptions,
  Repository,
} from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { IMapper } from 'src/interfaces/mapper.interface';
import { BaseFindAllDto } from './dto/base.findall.dto';
import { IPagination } from 'src/interfaces/pagination.interface';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { IBaseService } from './interface/base.service.interface';

export class BaseService<Entity, CreateEntityDto, UpdateEntityDto>
  implements
    IBaseService<Entity, CreateEntityDto, UpdateEntityDto, BaseFindAllDto>
{
  protected repository: Repository<Entity>;
  protected mapper: IMapper<
    Entity,
    CreateEntityDto,
    UpdateEntityDto,
    BaseFindAllDto,
    DeepPartial<Entity>,
    QueryDeepPartialEntity<Entity>,
    FindManyOptions<Entity>,
    FindOneOptions<Entity>
  >;

  constructor(
    _repositoy: Repository<Entity>,
    _mapper: IMapper<
      Entity,
      CreateEntityDto,
      UpdateEntityDto,
      BaseFindAllDto,
      DeepPartial<Entity>,
      QueryDeepPartialEntity<Entity>,
      FindManyOptions<Entity>,
      FindOneOptions<Entity>
    >,
  ) {
    this.repository = _repositoy;
    this.mapper = _mapper;
  }

  async create(createDto: CreateEntityDto): Promise<Entity> {
    try {
      const payload = this.mapper.toCreatePayload(createDto);
      const entity = await this.repository.save(payload);

      return Promise.resolve(entity);
    } catch (err) {
      return Promise.reject(err);
    }
  }

  async findAll(findAllDto: BaseFindAllDto): Promise<IPagination<Entity>> {
    try {
      const options = this.mapper.toFindAllPayload(findAllDto);
      const [entities, count] = await this.repository.findAndCount(options);

      const paginate = this.mapper.toPaginate(
        entities,
        count,
        findAllDto.page,
        findAllDto.limit,
      );
      return Promise.resolve(paginate);
    } catch (err) {
      return Promise.reject(err);
    }
  }

  async findById(id: number | string): Promise<Entity> {
    try {
      const payload = this.mapper.toFindOne(id);
      const entity = await this.repository.findOne(payload);
      if (!entity) {
        throw new NotFoundException(`entity with id ${id} not found`);
      }

      return Promise.resolve(entity);
    } catch (err) {
      return Promise.reject(err);
    }
  }

  async updateById(
    id: number | string,
    updateDto: UpdateEntityDto,
  ): Promise<Entity> {
    try {
      await this.findById(id);
      const payload = this.mapper.toUpdatePayload(updateDto);
      await this.repository.update(id, payload);
      const existingEntity = await this.findById(id);

      return Promise.resolve(existingEntity);
    } catch (err) {
      return Promise.reject(err);
    }
  }

  async removeById(id: number | string): Promise<Entity> {
    try {
      const existingEntity = await this.findById(id);
      await this.repository.softDelete(id);

      return Promise.resolve(existingEntity);
    } catch (err) {
      return Promise.reject(err);
    }
  }
}
