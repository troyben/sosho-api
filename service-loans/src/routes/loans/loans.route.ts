import express from 'express';
import { celebrate } from 'celebrate';

import loanController from '../../controllers/loan.controller';
import loanSchema from '../../constants/schema/loan.schema';

const router = express.Router();

router.post(
  '/all',
  loanController.getAll
)

router.post(
  '/get-disbursed',
  loanController.getDisbursed
)

export default router;