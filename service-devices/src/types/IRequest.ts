import { Request } from 'express';
import { Loans } from '../entities/loans/loans.entity';
import { Users } from '../entities/user/user.entity';

export default interface IRequest extends Request {
  loan: Loans;
  user: Users;
  dashboard: boolean;
}
