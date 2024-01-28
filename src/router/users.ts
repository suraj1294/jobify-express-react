import express from "express";
import rateLimiter from "express-rate-limit";
import { updateUser, getApplicationStats } from "../controllers/users";
import {
  authorizePermissions,
  checkForTestUser,
  isAuthenticated,
  isOwner,
} from "../middlewares";
import upload from "../middlewares/multer";
import { validateUpdateUserInput } from "../middlewares/validation";

const apiLimiter = rateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20,
  message: { msg: "IP rate limit exceeded, retry in 15 minutes." },
});

export default (router: express.Router) => {
  //router.get("/users", isAuthenticated, getAllUsers);
  //router.delete("/users/:id", isAuthenticated, isOwner, deleteUser);
  //router.patch("/users/:id", isAuthenticated, isOwner, updateUser);

  router.get("/admin/app-stats", [
    authorizePermissions("admin"),
    getApplicationStats,
  ]);

  router.patch(
    "/update-user",
    isAuthenticated,
    upload.single("avatar"),
    validateUpdateUserInput,
    updateUser
  );
};
