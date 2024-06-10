
import { Users } from '../entities/user/user.entity';
import { sanitizeUser } from '../utilities/apiUtilities';
import { generateHash, verifyHash } from '../utilities/encryptionUtils';

import { myDataSource } from '../app-data-source';

const getUserById = async (userId: number) => {
  try {
    return sanitizeUser(
        await myDataSource.getRepository(Users).findOne({ where: { id: userId } }),
    );
  } catch (e) {
    return null;
  }
};

const getUserByEmail = async (
  email: string,
  getHash: boolean = false,
) => {
  try {
    return await myDataSource.getRepository(Users).findOne({ where: { email } });
  } catch (e) {
    return null;
  }
};

const createUser = async (
  email: string,
  pass: string,
  first_name: string = '',
  last_name: string = '',
) => {
  const newUser = new Users();
  newUser.email = email;
  newUser.password = await generateHash(pass, 10);
  newUser.first_name = first_name;
  newUser.last_name = last_name;
  return sanitizeUser(await myDataSource.getRepository(Users).save(newUser));
};

const updateUser = async (user: Users) => {
  return await myDataSource.getRepository(Users).save(user);
};

const loginUser = async (email: string, password: string) => {
  const user = await getUserByEmail(email, true);
  if (user) {
    if (await verifyHash(password, user.password)) {
      return sanitizeUser(user);
    }
  }
  return null;
};

export default {
  createUser,
  loginUser,
  getUserById,
};
