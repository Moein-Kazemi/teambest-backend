const AppError = require("./../utils/classes/AppError");

import { Request, Response, NextFunction } from "express";
import { CastError, Error as MongooseError } from "mongoose";
import { MongoError } from "mongodb";

// CUSTOM TYPE CHECKING FOR ERROR
interface CustomErrorProp {
  statusCode?: number;
  status?: string;
  isOprational?: boolean;
}
type AppErrorProp = Error & CustomErrorProp;

// HANDLE CAST ERROR IN DB
const handleCastErrorDb = (err: CastError): AppErrorProp => {
  const message = `مقدار ${err.value} برای فیلد ${err.path} نامعتبر است. `;
  return new AppError(message, 400);
};

// HANDLE DUPLICATE ERROR FILEDS
const handleDublicateFieldDb = (err: MongoError): AppErrorProp => {
  const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
  const message = `${value} تکراری است. لطفا یک ${value} دیگر وارد کنید.`;
  return new AppError(message, 400);
};

// HANDLE VALIDATION ERROR
const handleValidationDb = (
  err: MongooseError.ValidationError,
): AppErrorProp => {
  const message = err.message;
  return new AppError(message, 400);
};

// TOKEN ERRORS
const handleInvalidJwtToken = () => {
  return new AppError("Your token is invalid! please login again.", 401);
};
const handleExpiresJwtToken = () => {
  return new AppError("Your token is expired! please login again.", 401);
};

// SEND ERROR IN DEVELOPMENT ENVIREMENT
const sendErrorDev = (err: AppErrorProp, res: Response) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

// SEND ERROR IN PRODUCTION ENVIREMENT
const sendErrorProd = (err: AppErrorProp, res: Response) => {
  console.log(err.name);
  // OPRATIONAL ERROR
  if (err.isOprational === true) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });

    // PROGRAMMING ERROR OR UNKNOWN ERROR
  } else {
    console.error("Error ❌", err);

    res.status(500).json({
      status: "errro",
      message: "something went very wrong!",
    });
  }
};

module.exports = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  // DEVELOP ENVIERMENT
  if (process.env.NODE_ENV === "development") {
    sendErrorDev(err, res);

    // PRODUCTION ENVIERMENT
  } else if (process.env.NODE_ENV === "production") {
    let error: AppErrorProp = err;
    // CAST ERROR
    if (err.name === "CastError") {
      let castError = { ...err } as CastError;
      error = handleCastErrorDb(castError);
    }

    // DUPLICATE ERROR
    if (err.code === 11000) {
      error = handleDublicateFieldDb(err as MongoError);
    }

    // VALIDITION ERROR
    if (err.name === "ValidationError") {
      error = handleValidationDb(err as MongooseError.ValidationError);
    }

    // INVALID TOKEN
    if (err.name === "JsonWebTokenError") error = handleInvalidJwtToken();

    // EXPIRED TOKEN
    if (err.name === "TokenExpiredError") {
      error = handleExpiresJwtToken();
    }

    sendErrorProd(error, res);
  }
};
