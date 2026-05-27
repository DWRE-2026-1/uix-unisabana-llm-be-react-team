import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import routes from "./routes/index.js";
import { errorMiddleware, notFoundMiddleware } from "./middlewares/error.middleware.js";
import { getHealth } from "./modules/health/health.controller.js";

const app = express();

app.use(helmet());
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: false
}));
app.use(express.json());
app.use(morgan("dev"));

app.get("/", (_req, res) => {
  res.json({ message: "UIX backend running" });
});

app.get("/health", getHealth);

app.use("/api", routes);
app.use(notFoundMiddleware);
app.use(errorMiddleware);

export default app;
