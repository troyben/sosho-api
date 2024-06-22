import { db } from '../app-data-source';
import { Loans } from '../entities/loans/loans.entity';

const getAllLoans = async () => {
  try {
    return await db.getRepository(Loans).find();
  } catch (e) {
    throw e;
  }
}

const getDisbursed = async () => {
  try {
    return await db.getRepository(Loans).find({ where: { isDisbursed: true } });
  } catch (e) {
    throw e;
  }
}


export default {
  getAllLoans,
  getDisbursed
};
