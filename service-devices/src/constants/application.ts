const base: string = '/';

export default {
  url: {
    base,
  },
  timers: {
    userCookieExpiry: '24h',
  },
  env: {
    authSecret: process.env.JWT_SECRET || 'test',
  },
  authorizationIgnorePath: [
    `${base}user/auth/login`,
    `${base}user/auth/register`,
  ],
  users: {
    roles: {
      deny: 'Unverified'
    }
  }
};
