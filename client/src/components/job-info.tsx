import Wrapper from "../assets/wrappers/job-info";

const JobInfo = ({ icon, text }: { icon: JSX.Element; text: string }) => {
  return (
    <Wrapper>
      <span className="job-icon">{icon}</span>
      <span className="job-text">{text}</span>
    </Wrapper>
  );
};
export default JobInfo;
