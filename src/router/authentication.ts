import express from "express";
import rateLimiter from "express-rate-limit";
import { login, logout, register } from "../controllers/authentication";
import {
  validateLoginInput,
  validateRegisterInput,
} from "../middlewares/validation";
import { getCurrentUser } from "../controllers/users";
import { isAuthenticated } from "../middlewares";

const apiLimiter = rateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20,
  message: { msg: "IP rate limit exceeded, retry in 15 minutes." },
});

export default (router: express.Router) => {
  router.post("/auth/register", apiLimiter, validateRegisterInput, register);
  router.post("/auth/login", apiLimiter, validateLoginInput, login);
  router.get("/auth/logout", logout);
  router.get("/auth/current-user", isAuthenticated, getCurrentUser);
};
