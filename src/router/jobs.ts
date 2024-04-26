import express from "express";

import { checkForTestUser, isAuthenticated, isOwner } from "../middlewares";
import {
  deleteJob,
  getAllJobs,
  getJob,
  showStats,
  updateJob,
  createJob,
} from "../controllers/jobs";
import { validateIdParam, validateJobInput } from "../middlewares/validation";

export default (router: express.Router) => {
  router.get("/jobs", isAuthenticated, getAllJobs);
  router.post("/jobs", isAuthenticated, validateJobInput, createJob);
  router.route("/jobs/stats").get(isAuthenticated, showStats);
  router
    .route("/jobs/:id")
    .get(isAuthenticated, validateIdParam, getJob)
    .patch(
      checkForTestUser,
      isAuthenticated,
      validateJobInput,
      validateIdParam,
      updateJob
    )
    .delete(checkForTestUser, isAuthenticated, validateIdParam, deleteJob);
};
