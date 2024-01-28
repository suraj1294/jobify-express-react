import mongoose from "mongoose";
import dotenv from "dotenv";
import { UserModel } from "./models/users";
import { JobsModel } from "./models/job";
import jsonJobs from "./mock-data.json";

dotenv.config();

async function seed() {
  try {
    await mongoose.connect(process.env.DATABASE_URL);
    const user = await UserModel.findOne({ email: "john@gmail.com" });
    const jobs = jsonJobs.map((job) => {
      return { ...job, createdBy: user._id };
    });
    await JobsModel.deleteMany({ createdBy: user._id });
    await JobsModel.create(jobs);
    console.log("Success!!!");
    process.exit(0);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
}

seed();
