import { Joi, Segments } from 'celebrate';
import { LoanStatusEnum, LoanTypes } from '../enums'
export default {

  clientLoans: {
    [Segments.BODY]: {
      clientId: Joi.number().required(),
      statuses: Joi.array().items(Joi.string().valid(...Object.values(LoanStatusEnum))),
      types: Joi.array().items(Joi.string().valid(...Object.values(LoanTypes))),
    },
  },
  create: {
    [Segments.BODY]: {
      client_id: Joi.number().required(),
      loan_type: Joi.number().required(),
      amount: Joi.number().required(),
      payback_period: Joi.number().required(),
      interest_rate: Joi.number().required(),
      product: Joi.string(),
      product_price: Joi.number(),
      collateral_amount: Joi.number().required(),
      collateral_description: Joi.string().required(),
    }
  }
};
