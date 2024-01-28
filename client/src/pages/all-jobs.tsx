import { JobsContainer, SearchContainer } from "../components";
import axiosInstance from "../utils/custom-fetch";
import { LoaderFunction, useLoaderData } from "react-router-dom";
import { useContext, createContext } from "react";
import { QueryClient, useQuery } from "@tanstack/react-query";
import { JobsResponse } from "../models/jobs";

const allJobsQuery = (params: { [k: string]: string }) => {
  const { search, jobStatus, jobType, sort, page } = params;
  return {
    queryKey: [
      "jobs",
      search ?? "",
      jobStatus ?? "all",
      jobType ?? "all",
      sort ?? "newest",
      page ?? 1,
    ],
    queryFn: async () => {
      const { data } = await axiosInstance.get<JobsResponse>("/jobs", {
        params,
      });
      return data;
    },
  };
};

export const loader =
  (queryClient: QueryClient): LoaderFunction =>
  async ({ request }) => {
    const params = Object.fromEntries([
      ...new URL(request.url).searchParams.entries(),
    ]);

    await queryClient.ensureQueryData(allJobsQuery(params));
    return { searchValues: { ...params } };
  };

const AllJobsContext = createContext<{
  data?: JobsResponse;
  searchValues?: { [k: string]: string };
}>({});

const AllJobs = () => {
  const { searchValues } = useLoaderData() as {
    searchValues: { [k: string]: string };
  };
  const { data } = useQuery(allJobsQuery(searchValues));
  return (
    <AllJobsContext.Provider value={{ data, searchValues }}>
      <SearchContainer />
      <JobsContainer />
    </AllJobsContext.Provider>
  );
};

export const useAllJobsContext = () => useContext(AllJobsContext);

export default AllJobs;
