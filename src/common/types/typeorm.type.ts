import { FindOptionsWhere } from 'typeorm';

export type EntityFindOptions<T> = FindOptionsWhere<T> | FindOptionsWhere<T>[];
