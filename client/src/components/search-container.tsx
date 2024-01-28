import { FormRow, FormRowSelect } from ".";
import Wrapper from "../assets/wrappers/dashboard-form-page";
import { Form, useSubmit, Link } from "react-router-dom";

import { useAllJobsContext } from "../pages/all-jobs";
import { ChangeEvent } from "react";
import { JOB_SORT_BY, JOB_STATUS, JOB_TYPE } from "../utils/constants";

const SearchContainer = () => {
  const { searchValues } = useAllJobsContext();
  const { search, jobStatus, jobType, sort } = searchValues || {};
  const submit = useSubmit();

  const debounce = (onChange: (form: HTMLFormElement | null) => void) => {
    let timeout: ReturnType<typeof setTimeout>;

    return (e: ChangeEvent<HTMLInputElement>) => {
      const form = e.currentTarget.form;
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        onChange(form);
      }, 2000);
    };
  };
  return (
    <Wrapper>
      <Form className="form">
        <h5 className="form-title">search form</h5>
        <div className="form-center">
          <FormRow
            type="search"
            name="search"
            labelText=""
            defaultValue={search}
            onChange={debounce((form) => {
              submit(form);
            })}
          />

          <FormRowSelect
            labelText="job status"
            name="jobStatus"
            list={["all", ...Object.values(JOB_STATUS)]}
            defaultValue={jobStatus}
            onChange={(e) => {
              submit(e.currentTarget.form);
            }}
          />
          <FormRowSelect
            labelText="job type"
            name="jobType"
            list={["all", ...Object.values(JOB_TYPE)]}
            defaultValue={jobType}
            onChange={(e) => {
              submit(e.currentTarget.form);
            }}
          />
          <FormRowSelect
            name="sort"
            labelText=""
            defaultValue={sort}
            list={[...Object.values(JOB_SORT_BY)]}
            onChange={(e) => {
              submit(e.currentTarget.form);
            }}
          />
          <Link to="/dashboard/all-jobs" className="btn form-btn delete-btn">
            Reset Search Values
          </Link>
        </div>
      </Form>
    </Wrapper>
  );
};
export default SearchContainer;
