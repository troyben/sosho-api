import { Column, Entity, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { DateTimeEntity } from '../base/dateTimeEntity';

@Entity('role_user', { orderBy: {  id: 'ASC' } })
export class RoleUser extends DateTimeEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id?: number;

  @Column()
  role_id: number;

  @Column()
  @Unique(['user_id',])
  user_id: number;
}
