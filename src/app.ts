import cors from "cors";
import express, { Application, urlencoded } from "express";
import globalErrorHandler from "./app/middlewares/globalErrorHandler";
import notFoundPath from "./app/middlewares/notFoundPath";
import router from "./app/routes";
const app: Application = express();

app.use(cors());
// parser
app.use(express.json());
app.use(urlencoded({ extended: true }));

app.use("/api/v1", router);
app.use(globalErrorHandler);
app.use(notFoundPath);

export default app;
