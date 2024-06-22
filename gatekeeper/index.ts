// @ts-ignore
import express from 'express';
// @ts-ignore
import proxy from "express-http-proxy";
import * as dotenv from 'dotenv'
dotenv.config({ path: `.env.${process.env.NODE_ENV}` });
import application from './constants/application';
import microservices from './constants/microservices';
import authenticate from './middlewares/authenticate';
import { db } from './app-data-source';
import authService from './services/auth.service';
import { verifyToken } from './utilities/encryptionUtils';

const app = express();

import logger from './config/logger';

const auth = proxy(`${microservices.users.url}:${microservices.users.port}`, { proxyErrorHandler: (err, res) => {
    console.info(`\n${microservices.users.name} Error: ${err.code}, url ${microservices.users.url}:${microservices.users.port}`)
    logger.error(`${microservices.users.name} Error: ${err.code}, url ${microservices.users.url}:${microservices.users.port}`)
    res.status(500).send({success: false, message: `${microservices.users.name} Module Unavailable, Error ${err.code}`});
}});

const loans = proxy(`${microservices.loans.url}:${microservices.loans.port}`, { proxyErrorHandler: (err, res) => {
    console.info(`\n${microservices.loans.name} Error: ${err.code}, url ${microservices.loans.url}:${microservices.loans.port}`)
    logger.error(`${microservices.loans.name} Error: ${err.code}, url ${microservices.loans.url}:${microservices.loans.port}`)
    res.status(500).send({success: false, message: `${microservices.loans.name} Module Unavailable, Error ${err.code}`});
}});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(authenticate);

app.get("/heartbeat", (req: express.Request, res: express.Response) => {
    return res.status(200).send("Server Alive!");
})

app.post("/jwt-verify", async (req: express.Request, res: express.Response) => {
    if (!req.body.token) {
        return res.status(400).send({success: false, details: 'Invalid required field, token is required'})
    }
    const decode = await verifyToken(req.body.token)
    res.status(200).send({success: true, decode});
})

app.post("/jwt-sign", async (req: express.Request, res: express.Response) => {
    return authService.signToken(req, res);
})

app.post("/refresh-token", async (req: express.Request, res: express.Response) => {
    return authService.refreshToken(req,res);
})


/**
 * Register USERS Micro-service
 */
app.use(`${ application.url.base_v1 }/service-auth`, auth);
/**
 * Register LOANS Micro-service
 */
app.use(`${ application.url.base_v1 }/service-loans`, loans);



/**
 *
 * ===================================================
 *                  SIMPLE GATEWAY
 *    this is a small gateway which will obviously
 *         need to be improved in near future
 *
 *  TODO: Introduce or write a more efficient gateway
 *
 * ====================================================
 *
 **/
db.initialize().then(() => {

    console.log(`\n${microservices.gatekeeper.name} Database connection created`);

    const server = app.listen(microservices.gatekeeper.port, () => {
        console.log(`${microservices.gatekeeper.name} Running on PORT ${microservices.gatekeeper.port}`);
    });

    const exitHandler = () => {
        if (server) {
            server.close(() => {
                console.log("Server closed");
                process.exit(1);
            });
        } else {
            process.exit(1);
        }
    };

    const unexpectedErrorHandler = (error: unknown) => {
        console.error(error);
        exitHandler();
    };

    process.on("uncaughtException", unexpectedErrorHandler);
    process.on("unhandledRejection", unexpectedErrorHandler);
})


