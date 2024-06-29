import { Roles } from '../entities/roles/roles.entity';
import { db } from '../app-data-source';

const getRole = async (role: string) => {
  role = role || 'Unverified'
  return await db.getRepository(Roles).findOne({ where: { name: role } })
}


export { getRole }