import express, { Application, Request, Response, urlencoded } from "express";
import cors from "cors";
import { UserRoutes } from "./app/modules/User/user.routes";
const app: Application = express();

app.use(cors());
// parser
app.use(express.json());
app.use(urlencoded({ extended: true }));

app.get("/", (req: Request, res: Response) => {
  res.send({
    message: "PH Health Care",
  });
});

app.use("/api/v1/user", UserRoutes);

export default app;
