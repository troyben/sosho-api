import HttpStatusCode from 'http-status-codes';
import { NextFunction, Request, Response } from 'express';

import ApiResponse from './apiResponse';
import IRequest from '../types/IRequest';
import { Users } from '../entities/user/user.entity';

const extractUserIdFromRequest = (req: IRequest) => {
  return req.user && req.user.id;
};

const extractQueryForRequest = (req: Request, query: string) => {
  if (req.query[query]) {
    // @ts-ignore
    return JSON.parse(req.query[query]);
  }
  return [];
};

const extractCookieFromRequest = (req: Request, key: string) => {
  if (req.headers.authorization) {
    return req.headers.authorization.split(' ')[1];
  }
  if (req.headers.cookie) {
    const results = req.headers.cookie.split(';');
    const filtered = results.filter((result: string) => {
      return result.trim().startsWith(`${key}=`);
    });
    if (filtered.length > 0) {
      return filtered[0].split('=')[1];
    }
  }
  return null;
};

const sanitizeUser = (user: Users) => {
  const { password, ...userWithOutPassword } = user;
  return userWithOutPassword;
};

const restrictToStaff = (
  req: IRequest,
  res: Response,
  next: NextFunction,
) => {
  if (!req.user.activated) {
    ApiResponse.error(res, HttpStatusCode.FORBIDDEN);
    return;
  }
  next();
};

export {
  extractUserIdFromRequest,
  extractQueryForRequest,
  sanitizeUser,
  extractCookieFromRequest,
  restrictToStaff,
};
