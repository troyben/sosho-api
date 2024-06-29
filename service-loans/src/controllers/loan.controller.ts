import httpStatusCodes from 'http-status-codes';
import IController from 'IController';
import loanService from '../services/loan.service';
import apiResponse from '../utilities/apiResponse';
import locale from '../constants/locale';
import { Loans } from '../entities/loans/loans.entity';
import axios from 'axios';
import process from 'node:process';
import { extractCookieFromRequest } from '../utilities/apiUtilities';
import appConstants from "../constants/application";

import Constants from '../constants';


const gatekeeperUrl = process.env.GATEKEEPER_URL
const gatekeeperPort = process.env.GATEKEEPER_PORT


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

const getClientLoans: IController = async (req, res) => {
  try {
    const clientId: number = req.body.clientId
    const types: string[] = req.body.types
    const statuses: string[] = req.body.statuses

    const activeLoans: Loans[] = await loanService.getClientLoans(clientId, types,statuses);


    apiResponse.result(res, activeLoans, httpStatusCodes.OK);
  } catch (e) {
    apiResponse.error(
      res,
      httpStatusCodes.BAD_REQUEST,
      e.message || locale.INVALID_CREDENTIALS,
    );
    return;
  }
}

const create: IController = async (req, res) => {
  try {
    const token = extractCookieFromRequest(req, Constants.Cookie.USER_TOKEN);

    const headers = {
      'Authorization': `Bearer ${token}`
    }

    const creator: any = await axios.post(`${gatekeeperUrl}:${gatekeeperPort}/api/v1/service-auth/user/auth/me`, {}, { headers: headers })
      .then((response: any) =>response.data.data);

    if (!creator) {
      throw {message: "Error, creator not found!"};
    }

    const payload = req.body;
    payload.creator = parseInt(creator.id);

    /**
     * NOTE to future me: field (monthly) does not have default value on DB level
     * This can be quickly fixed by MIGRATION but no need since value is later updated on Loan disbursement
     **/
    payload.monthly = 0;

    payload.created_at = new Date();
    payload.updated_at = new Date();
    payload.loan_number = `SPL-${Math.round(+new Date()/1000)}-C`

    const results = await loanService.create(payload);

    apiResponse.result(res, [results], httpStatusCodes.OK);
    return;
  } catch (e) {

    let status = 400
    let errMsg = null

    if (e.response) {
      status = e.response.status
      errMsg = e.response.data.message
    }

    apiResponse.error(
      res,
      status || httpStatusCodes.BAD_REQUEST,
      errMsg || e.message || locale.INVALID_CREDENTIALS,
    );
    return;
  }
}


const settings: IController = async (req, res) => {
  try {
    const settings: any = {
      loan_status: appConstants.loan_status,
      loan_type: appConstants.loan_type,
      payback_period: appConstants.payback_period,
    }

    apiResponse.result(res, settings, httpStatusCodes.OK);
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
  getDisbursed,
  getAll,
  create,
  getClientLoans,
  settings
}