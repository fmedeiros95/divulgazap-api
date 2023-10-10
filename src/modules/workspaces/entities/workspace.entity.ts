import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { EntityAbstract } from '~/common/abstracts';
import { User } from '~/modules/users/entities';

@Entity('workspaces')
export class Workspace extends EntityAbstract {
  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  ownerId: string;

  @ManyToOne(() => User, user => user.workspaces, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  @JoinColumn({ name: 'ownerId' })
  owner: User;
}
