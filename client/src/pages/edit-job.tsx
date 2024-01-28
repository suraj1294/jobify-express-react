import { FormRow, FormRowSelect, SubmitBtn } from "../components";
import Wrapper from "../assets/wrappers/dashboard-form-page";
import { ActionFunction, useLoaderData } from "react-router-dom";

import { Form, redirect } from "react-router-dom";
import { toast } from "sonner";
import axiosInstance from "../utils/custom-fetch";
import { QueryClient, useQuery } from "@tanstack/react-query";
import { JOB_STATUS, JOB_TYPE } from "../utils/constants";
import { AxiosError } from "axios";

const singleJobQuery = (id: string) => {
  return {
    queryKey: ["job", id],
    queryFn: async () => {
      const { data } = await axiosInstance.get(`/jobs/${id}`);
      return data;
    },
  };
};

export const loader =
  (queryClient: QueryClient): ActionFunction =>
  async ({ params }) => {
    const { id = "" } = params;

    try {
      await queryClient.ensureQueryData(singleJobQuery(id));
      return id;
    } catch (error) {
      if (error instanceof AxiosError) toast.error(error?.response?.data?.msg);
      return redirect("/dashboard/all-jobs");
    }
  };
export const action =
  (queryClient: QueryClient): ActionFunction =>
  async ({ request, params }) => {
    const formData = await request.formData();
    const data = Object.fromEntries(formData);
    try {
      await axiosInstance.patch(`/jobs/${params.id}`, data);
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
      toast.success("Job edited successfully");
      return redirect("/dashboard/all-jobs");
    } catch (error) {
      if (error instanceof AxiosError) toast.error(error?.response?.data?.msg);
      return error;
    }
  };

const EditJob = () => {
  const id = useLoaderData() as string;

  const {
    data: { job },
  } = useQuery(singleJobQuery(id));

  return (
    <Wrapper>
      <Form method="post" className="form">
        <h4 className="form-title">edit job</h4>
        <div className="form-center">
          <FormRow type="text" name="position" defaultValue={job.position} />
          <FormRow type="text" name="company" defaultValue={job.company} />
          <FormRow
            type="text"
            name="jobLocation"
            labelText="job location"
            defaultValue={job.jobLocation}
          />
          <FormRowSelect
            name="jobStatus"
            labelText="job status"
            defaultValue={job.jobStatus}
            list={Object.values(JOB_STATUS)}
          />
          <FormRowSelect
            name="jobType"
            labelText="job type"
            defaultValue={job.jobType}
            list={Object.values(JOB_TYPE)}
          />
          <SubmitBtn formBtn />
        </div>
      </Form>
    </Wrapper>
  );
};
export default EditJob;