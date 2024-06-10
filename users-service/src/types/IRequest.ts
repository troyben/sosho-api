import { Request } from 'express';
import { Users } from '../entities/user/user.entity';

export default interface IRequest extends Request {
  user: Users;
  dashboard: boolean;
}
