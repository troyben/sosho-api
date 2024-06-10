import { DataSource } from 'typeorm';
import connectionOptions from './config/ormconfig';

export const db = new DataSource(connectionOptions);
