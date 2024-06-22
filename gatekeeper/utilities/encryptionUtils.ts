import application from '../constants/application';
import constants from '../constants';

const jwt = require('jsonwebtoken');

const generateToken = async (payload: { [key: string]: string }) => {
  const data: { [key: string]: string } = payload;
  return await jwt.sign({ data }, application.env.authSecret, {
    algorithm: 'HS256',
    expiresIn: application.timers.userCookieExpiry,
  });
};

const generateRefreshToken = async (payload: { [key: string]: string }) => {
  const data: { [key: string]: string } = payload;
  return await jwt.sign({ data }, application.env.authRefreshSecret, {
    algorithm: 'HS256',
    expiresIn: application.timers.userRefreshCookieExpiry,
  });
};

const verifyToken = async (token: string): Promise<any> => new Promise((resolve) => {
  jwt.verify(
    token,
    application.env.authSecret,
    {algorithm: 'HS256'},
    (err: Error, decoded: any) => {
      if (err) {
        resolve({success: false, message: err.message, errCode: err.name});
      } else {
        decoded.success = true;
        resolve(decoded);
      }
    },
  );
});

const verifyRefreshToken = async (token: string): Promise<any> => new Promise((resolve) => {
  jwt.verify(
    token,
    application.env.authRefreshSecret,
    {algorithm: 'HS256'},
    (err: Error, decoded: any) => {
      if (err) {
        resolve({success: false, message: err.message, errCode: err.name});
      } else {
        decoded.success = true;
        resolve(decoded);
      }
    },
  );
});

const generateTokenCookie = async (userId: number, role: string) => {
  const payload = {
    [constants.Cookie.USER_ID]: userId.toString(),
    [constants.Cookie.USER_ROLE]: role.toString()
  }
  return {
    key: constants.Cookie.USER_TOKEN,
    value: await generateToken(payload),
  };
};

const generateRefreshTokenCookie = async (userId: number, role: string) => {
  const payload = {
    [constants.Cookie.USER_ID]: userId.toString(),
    [constants.Cookie.USER_ROLE]: role.toString()
  }
  return {
    key: constants.Cookie.USER_REFRESH_TOKEN,
    value: await generateRefreshToken(payload),
  };
};


export { generateToken, verifyToken, verifyRefreshToken, generateTokenCookie, generateRefreshTokenCookie };
