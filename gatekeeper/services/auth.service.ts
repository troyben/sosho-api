import { generateRefreshTokenCookie, generateTokenCookie, verifyRefreshToken } from '../utilities/encryptionUtils';
import apiResponse from '../utilities/apiResponse';
import httpStatusCodes from 'http-status-codes';
import userService from './user.service';
import Constants from '../constants';
import { Response } from 'express';

const signToken = async (req: any, res: Response) => {
  try{

    if (!req.body.id){
      throw {message: "Invalid required fields, id is required!"};
    }
    if (!req.body.role){
      throw {message: "Invalid required fields, role is required!"};
    }

    const token = await generateTokenCookie(req.body.id, req.body.role);
    const refreshToken = await generateRefreshTokenCookie(req.body.id, req.body.role);
    const user = await userService.getUserById(req.body.id);

    if (!user) {
      apiResponse.error(res, httpStatusCodes.UNAUTHORIZED);
      return;
    }

    const response = {
      token: token,
      refreshToken: refreshToken,
      data: { user }
    }

    return res.status(200).send(response);
  } catch (e) {
    apiResponse.error(res, httpStatusCodes.BAD_REQUEST, e.message);
    return;
  }
}

const refreshToken = async (req: any, res: Response) => {
  try {
    const isAuthorizedResponse = await verifyRefreshToken(req.body.refreshToken);

    if (!isAuthorizedResponse.success) {
      apiResponse.error(res, httpStatusCodes.UNAUTHORIZED, isAuthorizedResponse.message);
      return;
    }

    const user = await userService.getUserById(parseInt(isAuthorizedResponse.data[Constants.Cookie.USER_ID], 10));

    if (!user) {
      apiResponse.error(res, httpStatusCodes.UNAUTHORIZED);
      return;
    }

    const token = await generateTokenCookie(parseInt(isAuthorizedResponse.data[Constants.Cookie.USER_ID], 10), isAuthorizedResponse.data[Constants.Cookie.USER_ROLE]);
    const refreshToken = await generateRefreshTokenCookie(parseInt(isAuthorizedResponse.data[Constants.Cookie.USER_ID], 10), isAuthorizedResponse.data[Constants.Cookie.USER_ROLE]);

    const response = {
      token: token,
      refreshToken: refreshToken,
      data: { user }
    }

    apiResponse.result(res, response, httpStatusCodes.OK, {token, refreshToken });
    return;
  } catch (e) {
    apiResponse.error(res, httpStatusCodes.BAD_REQUEST, e.message);
    return;
  }
}

export default {
  refreshToken,
  signToken
};