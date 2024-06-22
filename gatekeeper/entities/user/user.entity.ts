import { Column, Entity, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { DateTimeEntity } from '../base/dateTimeEntity';

@Entity('users', { orderBy: {  id: 'ASC' } })
export class Users extends DateTimeEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column()
  @Unique(['email'])
  email?: string;

  @Column()
  first_name?: string;

  @Column({default: null})
  last_name?: string;

  @Column()
  password?: string;

  @Column()
  natid?: string;

  @Column()
  @Unique(['mobile'])
  mobile?: string;

  @Column()
  physical_address?: string;

  @Column({default: 'User'})
  role?: string;

  @Column()
  password_changed?: boolean;

  @Column({ type: 'timestamp', default: null })
  pwd_last_changed?: string;

  @Column({ default: true })
  activated?: boolean;

  @Column({ type: 'timestamp' })
  email_verified_at?: string;
}
