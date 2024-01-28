import { StatusCodes } from "http-status-codes";
import express from "express";

const errorHandlerMiddleware = (
  err: any,
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  console.log(err);
  const statusCode = err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;
  const msg = err.message || "something went wrong, try again later";
  res.status(statusCode).json({ msg });
};

export default errorHandlerMiddleware;
