import { FaSuitcaseRolling, FaCalendarCheck } from "react-icons/fa";
import { useLoaderData, redirect, LoaderFunction } from "react-router-dom";
import axiosInstance from "../utils/custom-fetch";
import Wrapper from "../assets/wrappers/stats-container";
import { toast } from "sonner";
import { StatItem } from "../components";

export const loader: LoaderFunction = async () => {
  try {
    const response = await axiosInstance.get("/users/admin/app-stats");
    return response.data;
  } catch (error) {
    toast.error("You are not authorized to view this page");
    return redirect("/dashboard");
  }
};

const Admin = () => {
  const { users, jobs } = useLoaderData() as { users: number; jobs: number };
  return (
    <Wrapper>
      <StatItem
        title="current users"
        count={users}
        color="#e9b949"
        bcg="#fcefc7"
        icon={<FaSuitcaseRolling />}
      />
      <StatItem
        title="total jobs"
        count={jobs}
        color="#647acb"
        bcg="#e0e8f9"
        icon={<FaCalendarCheck />}
      />
    </Wrapper>
  );
};
export default Admin;
