import express from "express";
import http from "http";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import compression from "compression";
import cors from "cors";
import "dotenv/config";

import router from "./router";
import mongoose from "mongoose";
import errorHandlerMiddleware from "./middlewares/errors";

// public
import { dirname } from "path";
import { fileURLToPath } from "url";
import path from "path";

const app = express();

app.use(
  cors({
    credentials: true,
  })
);

app.use(compression());
app.use(cookieParser());
app.use(bodyParser.json());

const server = http.createServer(app);

server.listen(8080, () => {
  console.log("Server running on http://localhost:8080/");
});

const MONGO_URL = process.env.DATABASE_URL;

mongoose.Promise = Promise;
mongoose.connect(MONGO_URL);
mongoose.connection.on("error", (error: Error) => console.log(error));

app.use("/api", router());

//app.use(express.static(path.join(__dirname, "../client/dist")));
app.use(express.static(path.join(__dirname, "../public")));

app.use("*", (req: express.Request, res: express.Response) => {
  res.status(404).json({ msg: "not found" });
});

app.use(errorHandlerMiddleware);
