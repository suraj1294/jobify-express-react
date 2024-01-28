import express from "express";
//import cloudinary from "cloudinary";
import {
  deleteUserById,
  getUsers,
  getUserById,
  UserModel,
} from "../models/users";
import { formatImage } from "../middlewares/multer";
import { get } from "lodash";
import { StatusCodes } from "http-status-codes";
import { JobsModel } from "../models/job";

import { v2 as cloudinary } from "cloudinary";
import mongoose from "mongoose";

cloudinary.config({
  cloud_name: "dtrmxxici",
  api_key: "347519815595344",
  api_secret: "zjzM1N-bFIkqeh_d1rJKgtjb6Gs",
});

export const getCurrentUser = async (
  req: express.Request,
  res: express.Response
) => {
  const currentUserId = get(req, "identity._id") as mongoose.Types.ObjectId;
  const user = await UserModel.findOne({ _id: currentUserId });
  const userWithoutPassword = user.toJSON();
  res.status(StatusCodes.OK).json({ user: userWithoutPassword });
};

export const getApplicationStats = async (
  req: express.Request,
  res: express.Response
) => {
  const users = await UserModel.countDocuments();
  const jobs = await JobsModel.countDocuments();
  res.status(StatusCodes.OK).json({ users, jobs });
};

export const getAllUsers = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const users = await getUsers();

    return res.status(200).json(users);
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
};

export const deleteUser = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { id } = req.params;

    const deletedUser = await deleteUserById(id);

    return res.json(deletedUser);
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
};

export const updateUser = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const currentUserId = get(req, "identity._id") as mongoose.Types.ObjectId;

    const newUser = { ...req.body };
    if (req.file) {
      const file = formatImage(req.file);
      const response = await cloudinary.uploader.upload(file, {
        folder: "jobify-profile-uploads",
      });
      newUser.avatar = response.secure_url;
      newUser.avatarPublicId = response.public_id;
    }

    const updatedUser = await UserModel.findByIdAndUpdate(
      currentUserId,
      newUser
    );

    if (req.file && updatedUser.avatarPublicId) {
      await cloudinary.uploader.destroy(updatedUser.avatarPublicId);
    }

    return res.status(StatusCodes.OK).json({ msg: "update user" });
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
};
