import { DataSource } from 'typeorm';
import connectionOptions from './config/ormconfig';

export const myDataSource = new DataSource(connectionOptions);
