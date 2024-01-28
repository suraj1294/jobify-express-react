import express from "express";
import { merge, get } from "lodash";

import { User, UserModel, getUserBySessionToken } from "../models/users";
import { BadRequestError, UnauthorizedError } from "../helpers/errors";
import { UserRole } from "../helpers/constants";
import mongoose from "mongoose";

export const isAuthenticated = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  try {
    const sessionToken = req.cookies["token"];

    if (!sessionToken) {
      return res.sendStatus(403);
    }

    const existingUser = await getUserBySessionToken(sessionToken);

    if (!existingUser) {
      return res.sendStatus(403);
    }

    merge(req, { identity: existingUser });

    return next();
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
};

export const isOwner = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  try {
    const { id } = req.params;
    const currentUserId = get(req, "identity._id") as mongoose.Types.ObjectId;

    if (!currentUserId) {
      return res.sendStatus(400);
    }

    if (currentUserId.toString() !== id) {
      return res.sendStatus(403);
    }

    next();
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
};

export const checkForTestUser = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  const currentUser = get(req, "identity");

  if (currentUser) throw new BadRequestError("Demo User. Read Only!");
  next();
};

export const authorizePermissions = (...roles: UserRole[]) => {
  return (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    const currentUser: User = get(req, "identity");

    if (!roles.includes(currentUser?.role)) {
      throw new UnauthorizedError("Unauthorized to access this route");
    }
    next();
  };
};
