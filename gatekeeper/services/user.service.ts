import { Users } from '../entities/user/user.entity';
import { sanitizeUser } from '../utilities/apiUtilities';
import { db } from '../app-data-source';

const getUserById = async (userId: number) => {
  try {
    return sanitizeUser(
        await db.getRepository(Users).findOne({ where: { id: userId } }),
    );
  } catch (e) {
    throw e;
  }
};

export default {
  getUserById,
};
