import { DataSourceOptions } from 'typeorm';
import { Users } from '../entities/user/user.entity';

const connectionOptions: DataSourceOptions = {
  type: 'mysql',
  host: process.env.DB_HOST || 'localhost',
  username: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'test',
  charset: 'utf8',
  synchronize: false,
  logging: true,
  entities:[
    './**/*.entity.{ts,js}',
  ],
  migrations: ['migration/*.ts'],
};

export default connectionOptions;
