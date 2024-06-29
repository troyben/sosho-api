import express from 'express';
import { celebrate } from 'celebrate';
import loanSchema from '../../constants/schema/loan.schema';

import loanController from '../../controllers/loan.controller';

const router = express.Router();

router.post(
  '/all',
  loanController.getAll
)

router.post(
  '/get-disbursed',
  loanController.getDisbursed
)

router.post(
  '/get-client-loans',
  celebrate(loanSchema.clientLoans),
  loanController.getClientLoans
)

router.post(
  '/create',
  celebrate(loanSchema.create),
  loanController.create
)

router.post(
  '/settings',
  loanController.settings
)



export default router;