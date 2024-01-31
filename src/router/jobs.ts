import express from "express";

import { checkForTestUser, isAuthenticated, isOwner } from "../middlewares";
import {
  deleteJob,
  getAllJobs,
  getJob,
  showStats,
  updateJob,
} from "../controllers/jobs";
import { validateIdParam, validateJobInput } from "../middlewares/validation";

export default (router: express.Router) => {
  router.get("/jobs", isAuthenticated, getAllJobs);
  router.route("/jobs/stats").get(showStats);
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
