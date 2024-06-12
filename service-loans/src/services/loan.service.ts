import { db } from '../app-data-source';
import { Loans } from '../entities/loans/loans.entity';

const getAllLoans = async () => {
  try {
    return await db.getRepository(Loans).find();
  } catch (e) {
    return null;
  }
}

const getDisbursed = async () => {
  try {
    return await db.getRepository(Loans).find({ where: { isDisbursed: true } });
  } catch (e) {
    return null;
  }
}


export default {
  getAllLoans,
  getDisbursed
};
