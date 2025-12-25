import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import authRouter from "./auth.js";
import router from "./api/routes.js";

const app = express();

const PORT = process.env.PORT ?? 3000;
const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN ?? "http://127.0.0.1:5173";

// Middleware
app.use(express.json())
app.use(cookieParser())
app.use(
  cors({
    origin: FRONTEND_ORIGIN,
    credentials: true,
  })
)

// Routes
app.use("/auth", authRouter);
app.use("/", router)

// Start Server
app.listen(PORT, () => {
  console.log(`API running on http:127.0.0.1:${PORT}`)
})