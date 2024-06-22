
import { Users } from '../entities/user/user.entity';
import { sanitizeUser } from '../utilities/apiUtilities';
import { generateHash, verifyHash } from '../utilities/encryptionUtils';
import { getRole, attachRole } from '../utilities/rolesAndPermissionsUtils';
import { db } from '../app-data-source';
import { Roles } from '../entities/roles/roles.entity';
import { RoleUser } from '../entities/roleUser/roleUser.entity';
import appConstants from '../constants/application';

const getUserById = async (userId: number) => {
  try {
    return sanitizeUser(
        await db.getRepository(Users).findOne({ where: { id: userId } }),
    );
  } catch (e) {
    throw e;
  }
};

const getUserByEmail = async (
  email: string,
  getHash: boolean = false,
) => {
  try {
    return await db.getRepository(Users).findOne({ where: { email } });
  } catch (e) {
    throw e;
  }
};

const getRoleUserByUserId = async (
  id: number,
) => {
  try {
    const roleUser = await db.getRepository(RoleUser).findOne({ where: { user_id: id } });
    if (roleUser) {
      return roleUser;
    }
    throw {message: "User role does not exist!"};
  } catch (e) {
    throw e
  }
};

const createUser = async (payload: Users) => {
  payload.password = await generateHash(payload.password, 10);
  payload.created_at = new Date();
  payload.updated_at = new Date();

  const role: Roles = await getRole(payload.role)

  if (role) {
    payload.role = role.name
    const user: Users = sanitizeUser(await db.getRepository(Users).save(payload));
    const userRole = await attachRole(user, role)

    if (user && userRole) return user;

    throw { message: "Something went wrong while creating user and attaching role, Please contact support to report issue" };
  }

  throw { message: "User role does not exist!" };
};

const updateUser = async (user: Users) => {
  return await db.getRepository(Users).save(user);
};

const updateRoleUser = async (roleUser: RoleUser) => {
  return await db.getRepository(RoleUser).save(roleUser);
};

const activateUser = async (email: string) => {
  const user = await getUserByEmail(email, false);
  if (user) {
    user.activated = true;
    if (await updateUser(user)) {
      return sanitizeUser(user);
    }
  }
  throw { message: "User does not exist!" };
}

const deactivateUser = async (email: string) => {
  const user = await getUserByEmail(email, false);
  if (user) {
    user.activated = false;
    if (await updateUser(user)) {
      return sanitizeUser(user);
    }
  }
  throw { message: "User does not exist!" };
}

const verify = async (email: string, verifyAs: string) => {
  const user: Users = await getUserByEmail(email, false);
  if (!user) throw { message: "User not found!" };

  const verifyAsRole: Roles = await getRole(verifyAs)
  if (!verifyAsRole) throw { message: "Role does not exist!" };

  const roleUser: RoleUser = await getRoleUserByUserId(user.id) || null
  if (!roleUser) throw { message: "Role-User record is not in the database!" };

  user.role = verifyAsRole.name;
  roleUser.role_id = verifyAsRole.id

  await updateUser(user)
  await updateRoleUser(roleUser)

  return sanitizeUser(user);
}

const deny = async (email: string) => {
  const user: Users = await getUserByEmail(email, false);
  if (!user) throw { message: "User not found!" };

  const verifyAsRole: Roles = await getRole(appConstants.users.roles.deny)
  if (!verifyAsRole) throw { message: "Role does not exist!" };

  const roleUser: RoleUser = await getRoleUserByUserId(user.id)
  if (!roleUser) throw { message: "Role-User record is not in the database!" };

  user.role = verifyAsRole.name;
  roleUser.role_id = verifyAsRole.id

  await updateUser(user)
  await updateRoleUser(roleUser)

  return sanitizeUser(user);
}

const loginUser = async (email: string, password: string) => {
  const user = await getUserByEmail(email, true);

  if (!user.activated) throw { message: "User is not activated! Please contact Administration" };

  if (user.role === 'Unverified') throw { message: "User is unverified! Please contact Administration" };

  if (user) {
    if (await verifyHash(password, user.password)) {
      return sanitizeUser(user);
    }
  }
  throw { message: "Invalid login credentials" };
};

export default {
  createUser,
  loginUser,
  getUserById,
  activateUser,
  deactivateUser,
  verify,
  deny
};
