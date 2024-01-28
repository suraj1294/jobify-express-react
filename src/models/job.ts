import { JOB_STATUS, JOB_TYPE } from "../helpers/constants";
import mongoose, { InferSchemaType } from "mongoose";
const JobSchema = new mongoose.Schema(
  {
    company: String,
    position: String,
    jobStatus: {
      type: String,
      enum: Object.values(JOB_STATUS),
      default: JOB_STATUS.PENDING,
    },
    jobType: {
      type: String,
      enum: Object.values(JOB_TYPE),
      default: JOB_TYPE.FULL_TIME,
    },
    jobLocation: {
      type: String,
      default: "my city",
    },
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
  },

  { versionKey: false, timestamps: true }
);

export const JobsModel = mongoose.model("Job", JobSchema);

export type Jobs = InferSchemaType<typeof JobSchema>;
