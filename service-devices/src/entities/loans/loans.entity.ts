import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { DateTimeEntity } from '../base/dateTimeEntity';

@Entity('loans', { orderBy: {  id: 'ASC' } })
export class Loans extends DateTimeEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column()
  creator: number;

  @Column()
  client_id?: number;

  @Column()
  loan_number?: string;

  @Column({default: 0})
  loan_type?: number;

  @Column()
  loan_status?: number;

  @Column({ type: 'numeric', precision: 10, scale: 2 })
  amount?: number;

  @Column()
  payback_period?: number;

  @Column({ type: 'numeric', precision: 10, scale: 2 })
  interest_rate?: number;

  @Column({ type: 'numeric', precision: 10, scale: 2 })
  monthly?: number;

  @Column({ type: 'numeric', precision: 10, scale: 2 })
  disbursed?: number;

  @Column({ type: 'numeric', precision: 10, scale: 2 })
  application_fee?: number;

  @Column({ type: 'numeric', precision: 10, scale: 2 })
  charges?: number;

  @Column()
  product?: string;

  @Column({ type: 'numeric', precision: 10, scale: 2 })
  product_price?: number;

  @Column()
  approved?: boolean;

  @Column()
  approval_ref?: string;

  @Column()
  disbursement_ref?: string;

  @Column()
  isDisbursed?: boolean;

  @Column()
  notes?: string;

  @Column()
  product_serial?: string;

  @Column({ type: 'numeric', precision: 10, scale: 2 })
  collateral_amount?: number;

  @Column()
  collateral_description?: string;
}
