import express from "express";

import authentication from "./authentication";
import users from "./users";
import jobs from "./jobs";

const router = express.Router();

export default (): express.Router => {
  authentication(router);
  users(router);
  jobs(router);

  return router;
};
