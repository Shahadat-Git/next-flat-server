import express, { Application, Request, Response, urlencoded } from "express";
import cors from "cors";
import router from "./app/routes";
import globalErrorHandler from "./app/middlewares/globalErrorHandler";
import notFound from "./app/middlewares/notFound";
import sendResponse from "./app/utils/sendResponse";
import httpStatus from "http-status";

const app: Application = express();

// middleware
app.use(cors());
// parser
app.use(express.json());
app.use(urlencoded({ extended: true }));

app.get("/", (req: Request, res: Response) => {
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Server running",
    data: "Server is working well...✅",
  });
});

// all routes
app.use("/api", router);
// global error handler
app.use(globalErrorHandler);
// not found route
app.use(notFound);

export default app;
