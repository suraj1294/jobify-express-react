import { toast } from "sonner";
import axiosInstance from "../utils/custom-fetch";
import { ActionFunction, redirect } from "react-router-dom";
import { QueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";

export const action =
  (queryClient: QueryClient): ActionFunction =>
  async ({ params }) => {
    try {
      await axiosInstance.delete(`/jobs/${params.id}`);
      queryClient.invalidateQueries({ queryKey: ["jobs"] });

      toast.success("Job deleted successfully");
    } catch (error) {
      if (error instanceof AxiosError) toast.error(error?.response?.data?.msg);
    }
    return redirect("/dashboard/all-jobs");
  };
