import "dotenv/config";
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import authRouter from "./auth.js";
import router from "./endpoints/routes.js";

export const app = express();

const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN ?? "https://spotifylisten.vercel.app/api";

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: FRONTEND_ORIGIN,
    credentials: true,
  })
);

app.use("/auth", authRouter);
app.use("/", router);
