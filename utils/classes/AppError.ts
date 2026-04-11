class AppError extends Error {
  statusCode: number;
  status: string;
  isOprational: boolean;

  constructor(message: string, statusCode: number) {
    super(message);
    ((this.statusCode = statusCode),
      (this.status = `${statusCode}`.startsWith("4") ? "fail" : "error"));
    ((this.isOprational = true),
      Error.captureStackTrace(this, this.constructor));
  }
}

module.exports = AppError;
