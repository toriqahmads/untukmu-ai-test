import { BaseFindAllDto } from './dto/base.findall.dto';
import { DeepPartial, FindManyOptions, FindOneOptions } from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { IPagination } from 'src/interfaces/pagination.interface';
import { paginate } from 'src/helpers/pagination.helper';
import { IBaseMapper } from './interface/base.mapper.interface';

export abstract class BaseMapper<Entity, CreateDto, UpdateDto>
  implements IBaseMapper<Entity, CreateDto, UpdateDto, BaseFindAllDto>
{
  abstract toCreatePayload(createDto: CreateDto): DeepPartial<Entity>;
  abstract toUpdatePayload(
    updateDto: UpdateDto,
  ): QueryDeepPartialEntity<Entity>;
  abstract toFindAllPayload(
    findAllDto: BaseFindAllDto,
  ): FindManyOptions<Entity>;
  abstract toFindOne(id: number | string): FindOneOptions<Entity>;

  toPaginate(
    entities: Entity[],
    total_data: number,
    page: number,
    limit: number,
  ): IPagination<Entity> {
    page = Number(page) || 1;
    limit = Number(limit) || 25;
    return paginate(entities, total_data, page, limit);
  }
}
