import httpStatusCodes from 'http-status-codes';
import IController from 'IController';
import loanService from '../services/loan.service';
import apiResponse from '../utilities/apiResponse';
import locale from '../constants/locale';
import { Loans } from '../entities/loans/loans.entity';

const getDisbursed: IController = async (req, res) => {
  try {
    const loans: Loans[] = await loanService.getDisbursed();
    apiResponse.result(res, loans, httpStatusCodes.OK);
  } catch (e) {
    apiResponse.error(
      res,
      httpStatusCodes.BAD_REQUEST,
      e.message || locale.INVALID_CREDENTIALS,
    );
    return;
  }
}

const getAll: IController = async (req, res) => {
  try {
    const loans: Loans[] = await loanService.getAllLoans();
    apiResponse.result(res, loans, httpStatusCodes.OK);
  } catch (e) {
    apiResponse.error(
      res,
      httpStatusCodes.BAD_REQUEST,
      e.message || locale.INVALID_CREDENTIALS,
    );
    return;
  }
}

export default {
  getDisbursed,getAll
}