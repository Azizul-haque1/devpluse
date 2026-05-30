import express, { type Application } from "express";
import { authRouter } from "./modules/auth/auth.route";
import { issuesRouter } from "./modules/issues/issues.routes";

const app: Application = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "DevPulse API is running",
  });
});

app.use("/api/auth", authRouter);
app.use("/api/issues", issuesRouter);

export default app;
