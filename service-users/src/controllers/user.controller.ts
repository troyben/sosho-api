import httpStatusCodes from 'http-status-codes';

import locale from '../constants/locale';
import IController from '../types/IController';
import apiResponse from '../utilities/apiResponse';
import userService from '../services/user.service';
import { Users } from '../entities/user/user.entity';
import { extractCookieFromRequest } from '../utilities/apiUtilities';
import Constants from '../constants';
import axios from 'axios';
import * as process from 'node:process';

const gatekeeperUrl = process.env.GATEKEEPER_URL
const gatekeeperPort = process.env.GATEKEEPER_PORT



const login: IController = async (req, res) => {
  try {
    const user = await userService.loginUser(
      req.body.email,
      req.body.password,
    );
    if (user) {
      const isAuthorizedResponse: any = await axios.post(`${gatekeeperUrl}:${gatekeeperPort}/jwt-sign`, user)
        .then((response: any) =>response.data);

      console.log('isAuthorizedResponse', isAuthorizedResponse);


      if (
        isAuthorizedResponse.token.key === 'token' && isAuthorizedResponse.token.value.length > 0 &&
        isAuthorizedResponse.refreshToken.key === 'refreshToken' && isAuthorizedResponse.refreshToken.value.length > 0
      ) {
        const response = {
          token: isAuthorizedResponse.token.value,
          refreshToken: isAuthorizedResponse.refreshToken.value,
          data: { user }
        }
        apiResponse.result(res, response, httpStatusCodes.OK, isAuthorizedResponse);
        return;
      }
      apiResponse.error(
        res,
        httpStatusCodes.BAD_REQUEST,
        locale.INVALID_CREDENTIALS,
      );
      return;
    }
    apiResponse.error(
      res,
      httpStatusCodes.BAD_REQUEST,
      locale.INVALID_CREDENTIALS,
    );
    return;
  } catch (e) {
    console.log('ERROR ==> ', e.message);

    apiResponse.error(
      res,
      httpStatusCodes.BAD_REQUEST,
      e.message || locale.INVALID_CREDENTIALS,
    );
    return;
  }
};

const logout: IController = async (req, res) => {
  const authorizationHeader = extractCookieFromRequest(
    req,
    Constants.Cookie.USER_TOKEN,
  );
  if (authorizationHeader) {
    res.clearCookie('token');
    res.clearCookie('refreshToken');
    res.json({ message: "Logged out successfully",success: true});
    return;
  }
  apiResponse.error(res, httpStatusCodes.BAD_REQUEST, "No User currently logged in the system");
  return;
}

const register: IController = async (req, res) => {
  let user;
  const payload: Users = req.body;

  try {
    user = await userService.createUser(payload);

    const isAuthorizedResponse: any = await axios.post(`${gatekeeperUrl}:${gatekeeperPort}/jwt-sign`, user)
      .then((response: any) =>response.data);

    if (
      isAuthorizedResponse.token.key === 'token' && isAuthorizedResponse.token.value.length > 0 &&
      isAuthorizedResponse.refreshToken.key === 'refreshToken' && isAuthorizedResponse.refreshToken.value.length > 0
    ) {
      const response = {
        token: isAuthorizedResponse.token.value,
        refreshToken: isAuthorizedResponse.refreshToken.value,
        data: { user }
      }
      apiResponse.result(res, response, httpStatusCodes.OK, isAuthorizedResponse);
      return;
    }
    apiResponse.error(
      res,
      httpStatusCodes.BAD_REQUEST,
      locale.INVALID_CREDENTIALS,
    );
    return;

  } catch (e) {
      apiResponse.error(
        res,
        httpStatusCodes.BAD_REQUEST,
        e.sqlMessage || e.message,
      );
      return;
  }

};

const activate: IController = async (req, res) => {
  let user;
  try {
    user = await userService.activateUser(req.body.email)
    if (user) {
      apiResponse.result(res, user, httpStatusCodes.OK);
    } else {
      apiResponse.error(res, httpStatusCodes.BAD_REQUEST);
    }
  } catch (e) {
    apiResponse.error(
      res,
      httpStatusCodes.BAD_REQUEST,
      e.sqlMessage || e.message,
    );
    return;
  }
}

const deactivate: IController = async (req, res) => {
  let user;
  try {
    user = await userService.deactivateUser(req.body.email)
    if (user) {
      apiResponse.result(res, user, httpStatusCodes.OK);
    } else {
      apiResponse.error(res, httpStatusCodes.BAD_REQUEST);
    }
  } catch (e) {
    apiResponse.error(
      res,
      httpStatusCodes.BAD_REQUEST,
      e.sqlMessage || e.message,
    );
    return;
  }
}

const verify: IController = async (req, res) => {
  let user;
  try {
    user = await userService.verify(req.body.email, req.body.verifyAs)
    if (user) {
      apiResponse.result(res, user, httpStatusCodes.OK);
    } else {
      apiResponse.error(res, httpStatusCodes.BAD_REQUEST);
    }
  } catch (e) {
    apiResponse.error(
      res,
      httpStatusCodes.BAD_REQUEST,
      e.sqlMessage || e.message,
    );
    return;
  }
}

const deny: IController = async (req, res) => {
  let user;
  try {
    user = await userService.deny(req.body.email)
    if (user) {
      apiResponse.result(res, user, httpStatusCodes.CREATED);
    } else {
      apiResponse.error(res, httpStatusCodes.BAD_REQUEST);
    }
  } catch (e) {
    apiResponse.error(
      res,
      httpStatusCodes.BAD_REQUEST,
      e.sqlMessage || e.message,
    );
    return;
  }
}

const self: IController = async (req, res) => {
  try {
    const token = extractCookieFromRequest(req, Constants.Cookie.USER_TOKEN);

    const isAuthorizedResponse: any = await axios.post(`${gatekeeperUrl}:${gatekeeperPort}/jwt-verify`, { token })
      .then((response: any) =>response.data);

    const user = await userService.getUserById(parseInt(isAuthorizedResponse.decode.data.userId, 10))

    if (user) {
      apiResponse.result(res, user, httpStatusCodes.OK);
      return
    }
    apiResponse.error(res, httpStatusCodes.UNAUTHORIZED);
    return;
  } catch (e) {
    apiResponse.error(
      res,
      httpStatusCodes.BAD_REQUEST,
      e.sqlMessage || e.message,
    );
    return;
  }
};


export default {
  login,
  logout,
  register,
  self,
  activate,
  deactivate,
  verify,
  deny
};
