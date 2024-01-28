import express from "express";

import { getUserByEmail, createUser } from "../models/users";
import { authentication, random } from "../helpers";
import { StatusCodes } from "http-status-codes";

export const login = async (req: express.Request, res: express.Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.sendStatus(400);
    }

    const user = await getUserByEmail(email).select(
      "+authentication.salt +authentication.password"
    );

    if (!user) {
      return res.status(400).json({ msg: "invalid credentials" });
    }
    const { authentication: _, ...userResponse } = user.toJSON();

    const expectedHash = authentication(user.authentication.salt, password);

    if (user.authentication.password != expectedHash) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ msg: "invalid credentials" });
    }

    const salt = random();
    user.authentication.sessionToken = authentication(
      salt,
      user._id.toString()
    );

    await user.save();

    const oneDay = 1000 * 60 * 60 * 24;

    res.cookie("token", user.authentication.sessionToken, {
      httpOnly: true,
      path: "/",
      secure: process.env.NODE_ENV === "production",
      expires: new Date(Date.now() + oneDay),
      sameSite: "strict",
    });

    return res.status(200).json(userResponse).end();
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
};

export const register = async (req: express.Request, res: express.Response) => {
  try {
    const { email, password, name, lastName, location } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ msg: "email or password can not be empty" });
    }

    const existingUser = await getUserByEmail(email);

    if (existingUser) {
      return res.status(400).json({ msg: "email already registered" });
    }

    const salt = random();
    const user = await createUser({
      email,
      name,
      lastName,
      location,
      authentication: {
        salt,
        password: authentication(salt, password),
      },
    });

    return res.status(200).json(user).end();
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
};

export const logout = (req: express.Request, res: express.Response) => {
  res.cookie("token", "logout", {
    httpOnly: true,
    expires: new Date(Date.now()),
  });
  res.status(200).json({ msg: "user logged out!" });
};
