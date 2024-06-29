export default {
  gatekeeper : {
    name: 'Gatekeeper',
    url: process.env.GATEKEEPER_URL,
    port: process.env.GATEKEEPER_PORT
  },
  users : {
    name: 'Users',
    url: process.env.MICRO_USERS_URL,
    port: process.env.MICRO_USERS_PORT
  },
  loans: {
    name: 'Loans',
    url: process.env.MICRO_LOANS_URL,
    port: process.env.MICRO_LOANS_PORT
  }
}