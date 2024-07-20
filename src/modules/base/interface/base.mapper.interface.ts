import { IMapper } from 'src/interfaces/mapper.interface';
import { DeepPartial, FindManyOptions, FindOneOptions } from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

export interface IBaseMapper<
  Entity,
  CreateEntityDto,
  UpdateEntityDto,
  FindAllEntityDto,
> extends IMapper<
    Entity,
    CreateEntityDto,
    UpdateEntityDto,
    FindAllEntityDto,
    DeepPartial<Entity>,
    QueryDeepPartialEntity<Entity>,
    FindManyOptions<Entity>,
    FindOneOptions<Entity>
  > {}
