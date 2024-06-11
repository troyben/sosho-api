// @ts-ignore
import express from 'express';
// @ts-ignore
import proxy from "express-http-proxy";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

import * as dotenv from 'dotenv'
dotenv.config({ path: `.env.${process.env.NODE_ENV}` });

const PORT = process.env.SERVER_PORT;
const HOST = process.env.SERVER_HOST;

const auth = proxy(`http://${HOST}:8081`);

app.get("/heartbeat", (req: express.Request, res: express.Response) => {
    res.status(200).send("I'M ALIVE!");
})

app.use("/api/v1", auth);

const server = app.listen(PORT, () => {
    console.log(`Gateway is Listening to Port ${PORT}`);
});

const exitHandler = () => {
    if (server) {
        server.close(() => {
            console.info("Server closed");
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
