import { PaginateQuery, Paginated } from 'nestjs-paginate';
import { DeepPartial, FindOptionsWhere } from 'typeorm';
import { EntityFindOptions } from '../types';

export interface CrudContract<T> {
  list(query: PaginateQuery, criteria?: EntityFindOptions<T>, relations?: EntityFindOptions<T>): Promise<Paginated<T>>;
  create(data: DeepPartial<T>): Promise<T>;
  findAll(relations?: EntityFindOptions<T>, withDeleted?: boolean): Promise<T[]>;
  findBy(criteria: FindOptionsWhere<T>, relations?: EntityFindOptions<T>, withDeleted?: boolean): Promise<T[]>;
  findOne(id: string, relations?: EntityFindOptions<T>, withDeleted?: boolean): Promise<T>;
  findOneBy(criteria: FindOptionsWhere<T>, relations?: EntityFindOptions<T>, withDeleted?: boolean): Promise<T>;
  update(data: DeepPartial<T>): Promise<T>;
  remove(id: string): Promise<T>;
  softRemove(id: string): Promise<T>;
  recover(id: string): Promise<T>;
}
