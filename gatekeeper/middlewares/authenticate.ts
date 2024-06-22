import express from 'express';
import httpStatusCodes from 'http-status-codes';

import Constants from '../constants';
import application from '../constants/application';
import apiResponse from '../utilities/apiResponse';
import { verifyToken } from '../utilities/encryptionUtils';
import { extractCookieFromRequest } from '../utilities/apiUtilities';
import userService from '../services/user.service';
import logger from '../config/logger';

/**
 * Route authentication middleware to verify a token
 *
 * @param {object} req
 * @param {object} res
 * @param {function} next
 *
 */

export default async (req: express.Request,res: express.Response,next: express.NextFunction) => {
  console.log('\nRequest made to: => ', req.originalUrl)
  logger.info(`Request made to: => ${req.originalUrl}`)

  if (application.authorizationIgnorePath.indexOf(`${req.originalUrl}`) === -1) {

    const authorizationHeader = extractCookieFromRequest(req, Constants.Cookie.USER_TOKEN);

    if (authorizationHeader) {
      const decoded = await verifyToken(authorizationHeader);

      if (!decoded.success) {
        apiResponse.error(res, httpStatusCodes.UNAUTHORIZED, decoded.message);
        return;
      }

      try {
        const user = await userService.getUserById(parseInt(decoded.data[Constants.Cookie.USER_ID], 10));
        if (!user) {
          apiResponse.error(res, httpStatusCodes.UNAUTHORIZED);
          return;
        }
      } catch (e) {
        apiResponse.error(res, httpStatusCodes.BAD_REQUEST, e.message);
        return;
      }

    } else {
      apiResponse.error(res, httpStatusCodes.FORBIDDEN);
      return;
    }
  }
  next();
};
