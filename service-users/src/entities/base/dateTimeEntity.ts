import { CreateDateColumn, UpdateDateColumn } from 'typeorm';

export class DateTimeEntity {
  @CreateDateColumn({ type: 'timestamp', nullable: false, default: 'NOW()'})
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp', nullable: false, default: 'NOW()' })
  updated_at: Date;
}
