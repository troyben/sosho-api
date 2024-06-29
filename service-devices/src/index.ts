import 'reflect-metadata';
import app from './config/express';
import logger from './config/logger';
import { db } from './app-data-source';
const PORT = process.env.SERVER_PORT;

const main = async () => {
  db.initialize().then(() => {
    console.log('Database connection create');
    logger.info('Database connection created');
    app.listen(PORT, () => {
      console.log(`Loans Service Running on PORT ${PORT}`);
      logger.info(`Loans Service running at ${PORT}`);
    });
  }).catch((err) => {
    console.error('Error during Data Source initialization:', err);
    logger.info(`Error during Data Source initialization: ${err}`);
  });
};

main().catch((err) => {
  console.error('Error: ', err);
});
