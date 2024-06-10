import 'reflect-metadata';
import app from './config/express';
import logger from './config/logger';
import { db } from './app-data-source';
const PORT = process.env.SERVER_PORT;

const main = async () => {
  db.initialize().then(() => {
    logger.info('database connection created');
    app.listen(PORT, () => {
      logger.info(`Server running at ${PORT}`);
    });
  }).catch((err) => {
    console.error('Error during Data Source initialization:', err);
  });
};

main().catch((err) => {
  console.error('Error: ', err);
});
