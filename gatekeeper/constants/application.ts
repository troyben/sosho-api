const base_v1: string = '/api/v1';

export default {
  url: {
    base_v1,
  },
  timers: {
    userCookieExpiry: '24h',
    userRefreshCookieExpiry: '24h',
  },
  env: {
    authSecret: process.env.JWT_SECRET || 'secret',
    authRefreshSecret: process.env.JWT_REFRESH_SECRET || 'refreshsecret',
  },
  authorizationIgnorePath: [
    '/jwt-sign',
    '/jwt-verify',
    '/refresh-token',
    `${base_v1}/service-auth/user/auth/login`,
    `${base_v1}/service-auth/user/auth/register`,
    `${base_v1}/service-auth/user/auth/logout`,
  ],
};
