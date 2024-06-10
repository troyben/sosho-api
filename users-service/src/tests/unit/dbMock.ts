// @ts-ignore
import * as typeorm from 'typeorm';
import { db } from '../../app-data-source';

export const mockQueryBuilder = (returnValue: any) => {
  // @ts-ignore
  myDataSource.createQueryBuilder = jest.fn().mockReturnValue({
    select: jest.fn().mockReturnThis(),
    from: jest.fn().mockReturnThis(),
    leftJoinAndSelect: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    orderBy: jest.fn().mockReturnThis(),
    getOne: jest.fn().mockResolvedValue(returnValue),
  });

  return db.createQueryBuilder;
};

export const mockRepository = (returnValue: any) => {
  // @ts-ignore
  myDataSource.getRepository = jest.fn().mockReturnValue({
    findOne: jest.fn().mockReturnValue(returnValue),
    save: jest.fn().mockReturnValue(returnValue),
  });

  return db.getRepository;
};
