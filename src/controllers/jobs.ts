import express from "express";
import { get } from "lodash";
import { JobsModel } from "../models/job";
import mongoose, { FilterQuery } from "mongoose";
import day from "dayjs";

const sortOptions = {
  newest: "-createdAt",
  oldest: "createdAt",
  "a-z": "position",
  "z-a": "-position",
};

export const getAllJobs = async (
  req: express.Request,
  res: express.Response
) => {
  const {
    search = "",
    jobStatus = "all",
    jobType = "all",
    sort = "newest",
  } = req.query;

  const currentUserId = get(req, "identity._id") as string;

  console.log(currentUserId);

  const sortKey =
    sortOptions[sort as keyof typeof sortOptions] || sortOptions.newest;

  // setup pagination

  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const queryObject: FilterQuery<typeof JobsModel> = {
    createdBy: currentUserId,
    $or: [
      { position: { $regex: search, $options: "i" } },
      { company: { $regex: search, $options: "i" } },
    ],
    ...(jobStatus !== "all" && { jobStatus }),
    ...(jobType !== "all" && { jobType }),
  };

  const jobs = await JobsModel.find(queryObject)
    .sort(sortKey)
    .skip(skip)
    .limit(limit);

  const totalJobs = await JobsModel.countDocuments(queryObject);
  const numOfPages = Math.ceil(totalJobs / limit);
  res.status(200).json({ totalJobs, numOfPages, currentPage: page, jobs });
};

export const createJob = async (
  req: express.Request,
  res: express.Response
) => {
  const currentUserId = get(req, "identity._id") as string;
  req.body.createdBy = currentUserId;
  const job = await JobsModel.create(req.body);
  res.status(201).json({ job });
};

export const getJob = async (req: express.Request, res: express.Response) => {
  const job = await JobsModel.findById(req.params.id);
  res.status(200).json({ job });
};

export const updateJob = async (
  req: express.Request,
  res: express.Response
) => {
  const updatedJob = await JobsModel.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
    }
  );

  res.status(200).json({ msg: "job modified", job: updatedJob });
};

export const deleteJob = async (
  req: express.Request,
  res: express.Response
) => {
  const removedJob = await JobsModel.findByIdAndDelete(req.params.id);
  res.status(200).json({ msg: "job deleted", job: removedJob });
};

export const showStats = async (
  req: express.Request,
  res: express.Response
) => {
  let currentUserId = get(req, "identity._id") as string;

  const stats = await JobsModel.aggregate([
    { $match: { createdBy: currentUserId } },
    { $group: { _id: "$jobStatus", count: { $sum: 1 } } },
  ]);

  const mappedStats = stats.reduce<Record<string, number>>((acc, curr) => {
    const { _id: title, count } = curr;
    acc[title] = count;
    return acc;
  }, {});

  const defaultStats = {
    pending: mappedStats.pending || 0,
    interview: mappedStats.interview || 0,
    declined: mappedStats.declined || 0,
  };

  let monthlyApplications = await JobsModel.aggregate([
    { $match: { createdBy: currentUserId } },
    {
      $group: {
        _id: { year: { $year: "$createdAt" }, month: { $month: "$createdAt" } },
        count: { $sum: 1 },
      },
    },
    { $sort: { "_id.year": -1, "_id.month": -1 } },
    { $limit: 6 },
  ]);

  monthlyApplications = monthlyApplications
    .map((item) => {
      const {
        _id: { year, month },
        count,
      } = item;

      const date = day()
        .month(month - 1)
        .year(year)
        .format("MMM YY");

      return { date, count };
    })
    .reverse();

  res.status(200).json({ defaultStats, monthlyApplications });
};
