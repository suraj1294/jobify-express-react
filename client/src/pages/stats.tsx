import { LoaderFunction } from "react-router-dom";
import { ChartsContainer, StatsContainer } from "../components";
import axiosInstance from "../utils/custom-fetch";
import { QueryClient, useQuery } from "@tanstack/react-query";

const statsQuery = {
  queryKey: ["stats"],
  queryFn: async () => {
    const response = await axiosInstance.get("/jobs/stats");
    return response.data;
  },
};

export const loader =
  (queryClient: QueryClient): LoaderFunction =>
  async () => {
    const data = await queryClient.ensureQueryData(statsQuery);
    return data;
  };

const Stats = () => {
  const { data } = useQuery(statsQuery);
  const { defaultStats, monthlyApplications } = data;

  return (
    <>
      <StatsContainer defaultStats={defaultStats} />
      {monthlyApplications?.length > 1 && (
        <ChartsContainer data={monthlyApplications} />
      )}
    </>
  );
};
export default Stats;
