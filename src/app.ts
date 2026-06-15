import express, { type Application } from "express";
import { authRouter } from "./modules/auth/auth.route";
import { issuesRouter } from "./modules/issues/issues.routes";
import globalErrorHandler from "./middleware/globalErrorHandler";
import cors from "cors";

const app: Application = express();

app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:5000", "http://localhost:4000"],
    credentials: true,
  })
);

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "DevPulse API is running",
  });
});

app.get("/error-test", (req, res) => {
  throw new Error("This is a test error");
});

app.use("/api/auth", authRouter);
app.use("/api/issues", issuesRouter);

app.use(globalErrorHandler);

export default app;
