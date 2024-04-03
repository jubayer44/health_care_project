import cors from "cors";
import express, { Application, urlencoded } from "express";
import cookieParser from "cookie-parser";
import notFoundPath from "./app/middlewares/notFoundPath";
import router from "./app/routes";
import globalErrorHandler from "./app/middlewares/globalErrorHandler";
const app: Application = express();

app.use(cors());
// parser
app.use(cookieParser());
app.use(express.json());

app.use(urlencoded({ extended: true }));

// middlewares
app.use("/api/v1", router);

app.use(globalErrorHandler);

app.use("*", notFoundPath);

export default app;
