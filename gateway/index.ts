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
const loans = proxy(`http://${HOST}:8082`);

app.get("/", (req: express.Request, res: express.Response) => {
    res.status(200).send("I'M ALIVE! API DOCS COMING SOON!");
})

app.use("/api/v1/service-auth", auth);
app.use("/api/v1/service-loans", loans);

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
