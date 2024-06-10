import { Column, Entity, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { DateTimeEntity } from '../base/dateTimeEntity';

@Entity('roles', { orderBy: {  id: 'ASC' } })
export class Roles extends DateTimeEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column()
  @Unique(['name'])
  name?: string;

  @Column()
  slug?: string;

  @Column({ default: null })
  description?: string;

  @Column()
  level?: number;
}
