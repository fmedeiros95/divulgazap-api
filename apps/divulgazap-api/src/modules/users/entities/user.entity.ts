import bcryptjs from 'bcryptjs';
import { Column, Entity, OneToMany } from 'typeorm';
import { EntityAbstract } from '~/common/abstracts';
import { Workspace } from '~/modules/workspaces/entities';

@Entity('users')
export class User extends EntityAbstract {
  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ default: false })
  isAdmin: boolean;

  @OneToMany(() => Workspace, workspace => workspace.owner)
  workspaces: Workspace[];

  hashPassword() {
    this.password = bcryptjs.hashSync(this.password, 8);
  }

  isValidPassword(password: string) {
    return bcryptjs.compareSync(password, this.password);
  }

  toJSON() {
    const obj = { ...this };
    delete obj.password;

    return obj;
  }
}
