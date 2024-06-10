import { Column, JoinColumn, ManyToOne } from 'typeorm';

import { Users } from '../user/user.entity';

export class UserRelatedEntity {
  @Column()
  userId: number;

  @ManyToOne(type => Users)
  @JoinColumn({ name: 'userId' })
  user: Users;
}
