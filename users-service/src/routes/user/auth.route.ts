import express from 'express';
import { celebrate } from 'celebrate';

import userController from '../../controllers/user.controller';
import userSchema from '../../constants/schema/user.schema';

const router = express.Router();

router.post(
  '/register',
  celebrate(userSchema.register),
  userController.register,
);
router.post(
  '/login',
  celebrate(userSchema.login),
  userController.login,
);
router.post(
  '/logout',
  celebrate(userSchema.logout),
  userController.logout,
);
router.post(
  '/activate',
  celebrate(userSchema.activate),
  userController.activate
)
router.post(
  '/deactivate',
  celebrate(userSchema.deactivate),
  userController.deactivate
)
router.post(
  '/verify',
  celebrate(userSchema.verify),
  userController.verify
)
router.post(
  '/deny',
  celebrate(userSchema.deny),
  userController.deny
)

router.get('/me', userController.self);

export default router;
