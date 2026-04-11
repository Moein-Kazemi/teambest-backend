import { Request, Response, NextFunction } from "express";

module.exports = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};
