import httpStatusCodes from 'http-status-codes';

import constants from '../constants';
import locale from '../constants/locale';
import IController from '../types/IController';
import apiResponse from '../utilities/apiResponse';
import userService from '../services/user.service';
import { generateCookie } from '../utilities/encryptionUtils';
import { Users } from '../entities/user/user.entity';
import { extractCookieFromRequest } from '../utilities/apiUtilities';
import Constants from '../constants';

const login: IController = async (req, res) => {
  try {
    const user = await userService.loginUser(
      req.body.email,
      req.body.password,
    );
    const cookie = await generateUserCookie(user.id);
    apiResponse.result(res, user, httpStatusCodes.OK, cookie);
  } catch (e) {
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
    Constants.Cookie.COOKIE_USER,
  );
  if (authorizationHeader) {
    res.clearCookie('jwt');
    res.clearCookie('user');
    apiResponse.result(res, {}, httpStatusCodes.OK, null);
  }
}

const register: IController = async (req, res) => {
  let user;
  const payload: Users = req.body;

  try {
    user = await userService.createUser(payload);
  } catch (e) {
      apiResponse.error(
        res,
        httpStatusCodes.BAD_REQUEST,
        e.sqlMessage || e.message,
      );
      return;
  }
  if (user) {
    const cookie = await generateUserCookie(user.id);
    apiResponse.result(res, user, httpStatusCodes.CREATED, cookie);
  } else {
    apiResponse.error(res, httpStatusCodes.BAD_REQUEST);
  }
};

const activate: IController = async (req, res) => {
  let user;
  try {
    user = await userService.activateUser(req.body.email)
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

const deactivate: IController = async (req, res) => {
  let user;
  try {
    user = await userService.deactivateUser(req.body.email)
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

  const verify: IController = async (req, res) => {
    let user;
    try {
      user = await userService.verify(req.body.email, req.body.verifyAs)
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
  const cookie = await generateUserCookie(req.user.id);
  apiResponse.result(res, req.user, httpStatusCodes.OK, cookie);
};

const generateUserCookie = async (userId: number) => {
  return {
    key: constants.Cookie.COOKIE_USER,
    value: await generateCookie(
      constants.Cookie.KEY_USER_ID,
      userId.toString(),
    ),
  };
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
