import * as typeorm from 'typeorm';

import UserService from './user.service';
import { mockRepository } from '../tests/unit/dbMock';
import { Users } from '../entities/user/user.entity';
import { verifyHash } from '../utilities/encryptionUtils';

describe('User service', () => {
  test('getUserById with existing user', async () => {
    mockRepository({ id: 1, password: '123456', first_name: 'Test', last_name: 'Test' });
    const actual = await UserService.getUserById(1);
    expect(actual.id).toBe(1);
    // @ts-ignore
    expect(actual.password).toBe(undefined);
    expect(actual.first_name).toBe('Test');
    expect(typeorm.getRepository(Users).findOne).toHaveBeenCalledTimes(
      1,
    );
    expect(typeorm.getRepository(Users).findOne).toHaveBeenCalledWith({
      id: 1,
    });
  });

  test('getUserById with non-existing user', async () => {
    // @ts-ignore
    typeorm.getRepository = jest.fn().mockReturnValue({
      findOne: jest.fn().mockImplementation(() => {
        throw new Error();
      }),
    });
    const actual = await UserService.getUserById(1);
    expect(actual).toBe(null);
    // @ts-ignore
    expect(typeorm.getRepository(Users).findOne).toHaveBeenCalledTimes(
      1,
    );
    expect(typeorm.getRepository(Users).findOne).toHaveBeenCalledWith({
      id: 1,
    });
  });

  test('createUser', async () => {
    const user: Users = {
      id: 1,
      password: '12345678',
      first_name: 'Test',
      email: 'test@test.com',
      created_at: new Date(),
      updated_at: new Date(),
    };
    mockRepository(user);
    const actual = await UserService.createUser(user);
    expect(actual.id).toBe(1);
    // @ts-ignore
    expect(actual.password).toBe(undefined);
    expect(actual.first_name).toBe(user.first_name);
    // expect(actual.email).toBe(user.email);
    expect(typeorm.getRepository(Users).save).toHaveBeenCalledTimes(1);
    expect(typeorm.getRepository(Users).save).toHaveBeenCalledWith(
      expect.objectContaining({
        email: user.email,
        password: expect.any(String),
        name: user.first_name,
      }),
    );
  });
  test('emailUser with non-existing user', async () => {
    const user = {
      id: 1,
      password: '123',
      name: 'Test user',
      email: 'test@test.com',
    };
    // @ts-ignore
    typeorm.getRepository = jest.fn().mockReturnValue({
      findOne: jest.fn().mockImplementation(() => {
        throw new Error();
      }),
      save: jest.fn().mockReturnValue(null),
    });
    const actual = await UserService.loginUser(
      user.email,
      user.password,
    );
    expect(actual).toBe(null);
    // @ts-ignore
    expect(typeorm.getRepository(Users).findOne).toHaveBeenCalledTimes(
      1,
    );
    expect(typeorm.getRepository(Users).findOne).toHaveBeenCalledWith({
      email: user.email,
    });
    expect(typeorm.getRepository(Users).save).toHaveBeenCalledTimes(0);
  });

  test('emailUser with existing user wrong password', async () => {
    const user = {
      id: 1,
      password: '123',
      name: 'Test user',
      email: 'test@test.com',
    };
    // @ts-ignore
    mockRepository(user);
    const actual = await UserService.loginUser(
      user.email,
      user.password,
    );
    expect(actual).toBe(null);
    // @ts-ignore
    expect(typeorm.getRepository(Users).findOne).toHaveBeenCalledTimes(
      1,
    );
    expect(typeorm.getRepository(Users).findOne).toHaveBeenCalledWith({
      email: user.email,
    });
    expect(typeorm.getRepository(Users).save).toHaveBeenCalledTimes(0);
  });

  test('emailUser with valid credentials', async () => {
    const user = {
      id: 1,
      password: '123',
      name: 'Test user',
      email: 'test@test.com',
    };
    // @ts-ignore
    mockRepository(user);

    // @ts-ignore
    verifyHash = () => new Promise<boolean>(resolve => resolve(true));
    const actual = await UserService.loginUser(
      user.email,
      user.password,
    );
    expect(actual.id).toBe(user.id);
    expect(actual.email).toBe(user.email);
    // @ts-ignore
    expect(typeorm.getRepository(Users).findOne).toHaveBeenCalledTimes(
      1,
    );
    expect(typeorm.getRepository(Users).findOne).toHaveBeenCalledWith({
      email: user.email,
    });
    expect(typeorm.getRepository(Users).save).toHaveBeenCalledTimes(1);
    expect(typeorm.getRepository(Users).save).toHaveBeenCalledWith(
      expect.objectContaining({
        ...user,
        lastLogin: expect.any(String),
      }),
    );
  });
});
