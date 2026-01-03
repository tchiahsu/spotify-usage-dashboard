import "dotenv/config";
import express from "express";
import cookieParser from "cookie-parser";
import authRouter from "./auth.js";
import router from "./endpoints/routes.js";

export const app = express();

app.use(express.json());
app.use(cookieParser());

app.use("/auth", authRouter);
app.use("/", router);
