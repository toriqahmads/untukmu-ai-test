import { IPagination } from 'src/interfaces/pagination.interface';

export interface IService<
  Entity,
  CreateEntityDto,
  UpdateEntityDto,
  FindAllEntityDto,
> {
  create(createDto: CreateEntityDto): Promise<Entity>;
  findAll(findAllDto: FindAllEntityDto): Promise<IPagination<Entity>>;
  findById(id: number | string): Promise<Entity>;
  updateById(id: number | string, updateDto: UpdateEntityDto): Promise<Entity>;
  removeById(id: number | string): Promise<Entity>;
}
