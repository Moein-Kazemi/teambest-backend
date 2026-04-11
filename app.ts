const express = require("express");
const app = express();
const morgan = require("morgan");
const cors = require("cors");

// TYPE CHECKER
import { Request, Response, NextFunction } from "express";

// LOG FOR REQUEST
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// CONECT TO FRONT END
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  }),
);

// body parser for read req.body
app.use(express.json());

// save request time
app.use((req: Request, res: Response, next: NextFunction) => {
  (req as any).requestDate = new Date().toISOString();

  next();
});

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    message: "you are request to the main direcory of express server teambest",
  });
});
/////// ROUTES
// app.use('/api/v1/tours', tourRouter);
// app.use('/api/v1/users', userRouter);

// app.all('*', (req: Request, res: Response, next: NextFunction) => {
//   // res.status(404).json({
//   //   status: 'fail',
//   //   message: `not found the ${req.originalUrl} route!`,
//   // });

//   next(new AppError(`not found the ${req.originalUrl} route!`, 400));
// });

// app.use(globalErrorHandler);

// TEST
// app.get("/", (req: Request, res: Response) => {
//   res.status(200).json({
//     message: "you are request to the main directory",
//   });
// });

module.exports = app;
