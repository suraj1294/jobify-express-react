import { body, param, validationResult } from "express-validator";
import express from "express";

import mongoose from "mongoose";

import {
  BadRequestError,
  NotFoundError,
  UnauthorizedError,
} from "../helpers/errors";
import { JobsModel } from "../models/job";
import { User, UserModel } from "../models/users";
import { JOB_STATUS, JOB_TYPE } from "../helpers/constants";
import { get } from "lodash";

const withValidationErrors = (validateValues: any) => {
  return [
    validateValues,
    (
      req: express.Request,
      res: express.Response,
      next: express.NextFunction
    ) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        const errorMessages = errors
          .array()
          .map((error) => error.msg) as string[];

        const firstMessage = errorMessages[0];
        console.log(Object.getPrototypeOf(firstMessage));
        if (firstMessage.startsWith("no job")) {
          throw new NotFoundError(firstMessage);
        }
        if (firstMessage.startsWith("not authorized")) {
          throw new UnauthorizedError("not authorized to access this route");
        }
        throw new BadRequestError(firstMessage);
      }
      next();
    },
  ];
};

export const validateJobInput = withValidationErrors([
  body("company").notEmpty().withMessage("company is required"),
  body("position").notEmpty().withMessage("position is required"),
  body("jobLocation").notEmpty().withMessage("job location is required"),
  body("jobStatus")
    .isIn(Object.values(JOB_STATUS))
    .withMessage("invalid status value"),
  body("jobType")
    .isIn(Object.values(JOB_TYPE))
    .withMessage("invalid type value"),
]);

export const validateIdParam = withValidationErrors([
  param("id").custom(async (value, { req }) => {
    const isValidMongoId = mongoose.Types.ObjectId.isValid(value);
    if (!isValidMongoId) throw new BadRequestError("invalid MongoDB id");
    const job = await JobsModel.findById(value);
    if (!job) throw new NotFoundError(`no job with id ${value}`);

    const currentUser = get(req, "identity") as User;

    const currentUserId = get(req, "identity._id") as mongoose.Types.ObjectId;

    const isAdmin = currentUser.role === "admin";
    const isOwner = currentUserId.toString() === job.createdBy.toString();

    if (!isAdmin && !isOwner)
      throw new UnauthorizedError("not authorized to access this route");
  }),
]);

export const validateRegisterInput = withValidationErrors([
  body("name").notEmpty().withMessage("name is required"),
  body("email")
    .notEmpty()
    .withMessage("email is required")
    .isEmail()
    .withMessage("invalid email format")
    .custom(async (email) => {
      const user = await UserModel.findOne({ email });
      if (user) {
        throw new BadRequestError("email already exists");
      }
    }),
  body("password")
    .notEmpty()
    .withMessage("password is required")
    .isLength({ min: 8 })
    .withMessage("password must be at least 8 characters long"),
  body("location").notEmpty().withMessage("location is required"),
  body("lastName").notEmpty().withMessage("last name is required"),
]);

export const validateLoginInput = withValidationErrors([
  body("email")
    .notEmpty()
    .withMessage("email is required")
    .isEmail()
    .withMessage("invalid email format"),
  body("password").notEmpty().withMessage("password is required"),
]);

export const validateUpdateUserInput = withValidationErrors([
  body("name").notEmpty().withMessage("name is required"),
  body("email")
    .notEmpty()
    .withMessage("email is required")
    .isEmail()
    .withMessage("invalid email format")
    .custom(async (email, { req }) => {
      const user = await UserModel.findOne({ email });
      const currentUserId = get(req, "identity._id") as mongoose.Types.ObjectId;
      if (user && user._id.toString() !== currentUserId.toString()) {
        throw new BadRequestError("email already exists");
      }
    }),

  body("location").notEmpty().withMessage("location is required"),
  body("lastName").notEmpty().withMessage("last name is required"),
]);
