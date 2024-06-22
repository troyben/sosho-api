const base: string = '/';
const gateway: string = process.env.GATEWAY || '';

export default {
  url: {
    base,
    gateway
  },
  timers: {
    userCookieExpiry: '24h',
  },
  env: {
    authSecret: process.env.JWT_SECRET || 'test',
  },
  authorizationIgnorePath: [
    `${base}jwt-sign`,
    `${base}jwt-authorization`,
    `${base}user/auth/login`,
    `${base}user/auth/register`,
  ],
  users: {
    roles: {
      deny: 'Unverified'
    }
  }
};
