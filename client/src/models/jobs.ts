export interface Jobs {
  _id: string;
  jobStatus: string;
  jobType: string;
  jobLocation: string;
  company?: string;
  position?: string;
  createdBy?: string;
  createdAt: string;
  updatedAt: string;
}

export interface JobsResponse {
  totalJobs: number;
  numOfPages: number;
  currentPage: number;
  jobs: Jobs[];
}
