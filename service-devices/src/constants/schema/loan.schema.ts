import { Joi, Segments } from 'celebrate';
export default {
  register: {
    [Segments.BODY]: {
      email: Joi.string().email().required(),
      password: Joi.string().min(6).max(32).required(),
      first_name: Joi.string().required(),
      last_name: Joi.string().required(),
      natid: Joi.string().required(),
      mobile: Joi.string().required(),
      physical_address: Joi.string().required(),
      role: Joi.string().optional().allow(null),
    },
  },
  login: {
    [Segments.BODY]: {
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    },
  },
  logout: {
    [Segments.BODY]: {
      email: Joi.string().email().required(),
    },
  },
  update: {
    body: {},
  },
  activate: {
    [Segments.BODY]: {
      email: Joi.string().email().required(),
    },
  },
  deactivate: {
    [Segments.BODY]: {
      email: Joi.string().email().required(),
    },
  },
  verify: {
    [Segments.BODY]: {
      email: Joi.string().email().required(),
      verifyAs: Joi.string().required(),
    },
  },
  deny: {
    [Segments.BODY]: {
      email: Joi.string().email().required(),
    },
  }
};
