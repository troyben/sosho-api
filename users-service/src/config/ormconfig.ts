import { DataSourceOptions } from 'typeorm';
import * as dotenv from 'dotenv'
dotenv.config({ path: `.env.${process.env.NODE_ENV}` });

const connectionOptions: DataSourceOptions = {
  type: 'mysql',
  host: process.env.DB_HOST,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  charset: 'utf8',
  synchronize: false,
  logging: process.env.NODE_ENV !== 'production',
  entities:[
    './**/*.entity.{ts,js}',
  ],
  migrations: ['migration/*.ts'],
};

export default connectionOptions;
