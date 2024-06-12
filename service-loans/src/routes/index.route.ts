import * as express from 'express';

import loans from './loans/loans.route';

const router = express.Router();

router.use('/loans', loans);

export default router;
