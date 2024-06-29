import express from 'express';
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

export default router;