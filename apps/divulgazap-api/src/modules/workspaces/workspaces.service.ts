import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FilterOperator, PaginateQuery, paginate } from 'nestjs-paginate';
import { DeepPartial, FindOptionsRelations, Repository } from 'typeorm';
import { CrudContract } from '~/common/contracts';
import { EntityFindOptions } from '~/common/types';
import { Workspace } from './entities';

@Injectable()
export class WorkspacesService implements CrudContract<Workspace> {
  constructor(@InjectRepository(Workspace) private readonly repository: Repository<Workspace>) {}

  list(query: PaginateQuery, where?: EntityFindOptions<Workspace>, relations?: FindOptionsRelations<Workspace>) {
    return paginate(query, this.repository, {
      sortableColumns: ['id', 'name', 'description', 'createdAt'],
      nullSort: 'last',
      defaultSortBy: [['createdAt', 'DESC']],
      searchableColumns: ['name', 'description'],
      filterableColumns: {
        name: [FilterOperator.ILIKE],
        description: [FilterOperator.ILIKE],
        createdAt: [FilterOperator.BTW],
      },
      defaultLimit: 10,
      maxLimit: 100,
      where,
      relations,
    });
  }

  create(data: DeepPartial<Workspace>) {
    const create = this.repository.create(data);
    return this.repository.save(create);
  }

  findAll(relations?: FindOptionsRelations<Workspace>, withDeleted?: boolean) {
    return this.repository.find({ relations, withDeleted });
  }

  findBy(where: EntityFindOptions<Workspace>, relations?: FindOptionsRelations<Workspace>, withDeleted?: boolean) {
    return this.repository.find({ where, relations, withDeleted });
  }

  findOne(id: string, relations?: FindOptionsRelations<Workspace>, withDeleted?: boolean) {
    return this.repository.findOne({ relations, withDeleted, where: { id } });
  }

  findOneBy(where: EntityFindOptions<Workspace>, relations?: FindOptionsRelations<Workspace>, withDeleted?: boolean) {
    return this.repository.findOne({ where, relations, withDeleted });
  }

  async update(data: DeepPartial<Workspace>) {
    const finded = await this.findOne(data.id);
    if (!finded) throw new NotFoundException('Resource not found');

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
