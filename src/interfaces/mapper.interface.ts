import { IPagination } from 'src/interfaces/pagination.interface';

export interface IMapper<
  Entity,
  CreateEntityDto,
  UpdateEntityDto,
  FindAllEntityDto,
  CreateMapper,
  UpdateMapper,
  FindAllMapper,
  FindOneMapper,
> {
  toCreatePayload(createDto: CreateEntityDto): CreateMapper;
  toUpdatePayload(updateDto: UpdateEntityDto): UpdateMapper;
  toFindAllPayload(findAllDto: FindAllEntityDto): FindAllMapper;
  toFindOne(id: number | string): FindOneMapper;
  toPaginate(
    entities: Entity[],
    total_data: number,
    page: number,
    limit: number,
  ): IPagination<Entity>;
}
