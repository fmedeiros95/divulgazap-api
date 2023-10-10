import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FilterOperator, PaginateQuery, paginate } from 'nestjs-paginate';
import { DeepPartial, FindOptionsRelations, FindOptionsWhere, Repository } from 'typeorm';
import { CrudContract } from '~/common/contracts';
import { EntityFindOptions } from '~/common/types';
import { User } from './entities';

@Injectable()
export class UsersService implements CrudContract<User> {
  constructor(@InjectRepository(User) private readonly repository: Repository<User>) {}

  list(query: PaginateQuery, where?: EntityFindOptions<User>, relations?: FindOptionsRelations<User>) {
    return paginate(query, this.repository, {
      sortableColumns: ['id', 'name', 'email', 'createdAt'],
      nullSort: 'last',
      defaultSortBy: [['createdAt', 'DESC']],
      searchableColumns: ['name', 'email'],
      filterableColumns: {
        name: [FilterOperator.ILIKE],
        email: [FilterOperator.ILIKE],
        createdAt: [FilterOperator.BTW],
      },
      defaultLimit: 10,
      maxLimit: 100,
      where,
      relations,
    });
  }

  create(data: DeepPartial<User>) {
    const create = this.repository.create(data);
    if (!data.password) create.password = Math.random().toString(36).slice(-8);
    create.hashPassword();
    return this.repository.save(create);
  }

  findAll(relations?: FindOptionsRelations<User>, withDeleted?: boolean) {
    return this.repository.find({ relations, withDeleted });
  }

  findBy(where: FindOptionsWhere<User>, relations?: FindOptionsRelations<User>, withDeleted?: boolean) {
    return this.repository.find({ where, relations, withDeleted });
  }

  findOne(id: string, relations?: FindOptionsRelations<User>, withDeleted?: boolean) {
    return this.repository.findOne({ relations, withDeleted, where: { id } });
  }

  findOneBy(where: FindOptionsWhere<User>, relations?: FindOptionsRelations<User>, withDeleted?: boolean) {
    return this.repository.findOne({ where, relations, withDeleted });
  }

  async update(data: DeepPartial<User>) {
    const finded = await this.findOne(data.id);
    if (!finded) throw new NotFoundException('Resource not found');

    if (data.password) {
      finded.password = data.password;
      finded.hashPassword();

      delete data.password;
    }

    Object.assign(finded, data);
    return this.repository.save(finded);
  }

  async remove(id: string) {
    const finded = await this.findOne(id);
    if (!finded) throw new NotFoundException('Resource not found');

    return this.repository.remove(finded);
  }

  async softRemove(id: string) {
    const finded = await this.findOne(id);
    if (!finded) throw new NotFoundException('Resource not found');

    return this.repository.softRemove(finded);
  }

  async recover(id: string) {
    const finded = await this.findOne(id, undefined, true);
    if (!finded) throw new NotFoundException('Resource not found');

    return this.repository.recover(finded);
  }
}
