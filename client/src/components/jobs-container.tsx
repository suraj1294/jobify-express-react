import Job from "./job";
import Wrapper from "../assets/wrappers/jobs-container";
import { useAllJobsContext } from "../pages/all-jobs";
import PageBtnContainer from "./page-btn-container";
const JobsContainer = () => {
  const { data } = useAllJobsContext();

  const { jobs = [], totalJobs = 0, numOfPages = 0 } = data || {};
  if (jobs.length === 0) {
    return (
      <Wrapper>
        <h2>No jobs to display...</h2>
      </Wrapper>
    );
  }
  return (
    <Wrapper>
      <h5>
        {totalJobs} job{jobs.length > 1 && "s"} found
      </h5>
      <div className="jobs">
        {jobs.map((job) => {
          return <Job key={job._id} {...job} />;
        })}
      </div>
      {numOfPages > 1 && <PageBtnContainer />}
    </Wrapper>
  );
};
export default JobsContainer;
