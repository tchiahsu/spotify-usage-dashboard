import "dotenv/config";
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import authRouter from "./auth.js";
import router from "./api/routes.js";

const app = express();

console.log("ENV PORT =", process.env.PORT);
const PORT = Number(process.env.PORT) || 8080;
console.log("Using PORT =", PORT);

const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN;

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
app.use("/auth", authRouter)
app.use("/", router)

// Railway proxy
app.set("trust proxy", 1)

// Start Server
app.listen(PORT, "0.0.0.0", () => {
  console.log(`API running on http://0.0.0.0:${PORT}`);

  // Startup Logs
  console.log("NODE_ENV =", process.env.NODE_ENV);
  console.log("FRONTEND_ORIGIN =", process.env.FRONTEND_ORIGIN);
});