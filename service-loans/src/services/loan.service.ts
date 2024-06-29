import { db } from '../app-data-source';
import { Loans } from '../entities/loans/loans.entity';
import { In, Not } from 'typeorm';

import appConstants from "../constants/application";

const create = async (payload: Loans) => {
  try {

    return await db.getRepository(Loans).save(payload);
  } catch (e) {
    throw e;
  }
}

const getAllLoans = async () => {
  try {
    return await db.getRepository(Loans).find({ where: { loan_type: 0 } });
  } catch (e) {
    throw e;
  }
}

const getDisbursed = async () => {
  try {
    return await db.getRepository(Loans).find({ where: { isDisbursed: true, loan_type: 0 } });
  } catch (e) {
    throw e;
  }
}

const getClientLoans = async (clientId: number, types: string[], statuses: string[]) => {
  const statusInclude: number[] = []
  console.log('\n========\n', appConstants.loan_status)

  statuses.forEach(status => {

  })


  const where: {client_id: number, loan_status?: any, loan_type?: number} = {
    client_id: clientId
    // loan_status: In(exclusions)
  }

  // if (type) {
  //   where.loan_type = type
  // }

  try {
    return await db.getRepository(Loans).find({ where: where });
  } catch (e) {
    throw e;
  }
}


export default {
  getAllLoans,
  getDisbursed,
  getClientLoans,
  create
};
