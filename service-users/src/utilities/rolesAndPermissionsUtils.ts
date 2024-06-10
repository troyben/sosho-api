import { Roles } from '../entities/roles/roles.entity';
import { db } from '../app-data-source';
import { Users } from '../entities/user/user.entity';
import { RoleUser } from '../entities/roleUser/roleUser.entity';

const getRole = async (role: string) => {
  role = role || 'Unverified'
  return await db.getRepository(Roles).findOne({ where: { name: role } })
}

const attachRole = async (user: Users, role: Roles) => {
  const payload: RoleUser = {
    role_id: role.id,
    user_id: user.id,
    created_at: new Date(),
    updated_at: new Date(),
  }
  return await db.getRepository(RoleUser).save(payload);
}


export { getRole, attachRole }