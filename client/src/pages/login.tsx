import {
  Link,
  Form,
  redirect,
  useNavigate,
  ActionFunction,
} from "react-router-dom";
import Wrapper from "../assets/wrappers/register-and-login-page";
import { FormRow, Logo, SubmitBtn } from "../components";
import axiosInstance from "../utils/custom-fetch";
import { toast } from "sonner";
import { QueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";

export const action =
  (queryClient: QueryClient): ActionFunction =>
  async ({ request }) => {
    const formData = await request.formData();
    const data = Object.fromEntries(formData);
    try {
      await axiosInstance.post("/auth/login", data);
      queryClient.invalidateQueries();
      toast.success("Login successful");
      return redirect("/dashboard");
    } catch (error) {
      if (error instanceof AxiosError) toast.error(error?.response?.data?.msg);
      return error;
    }
  };

const Login = () => {
  const navigate = useNavigate();

  const loginDemoUser = async () => {
    const data = {
      email: "test@test.com",
      password: "secret123",
    };
    try {
      await axiosInstance.post("/auth/login", data);
      toast.success("Take a test drive");
      navigate("/dashboard");
    } catch (error) {
      if (error instanceof AxiosError) toast.error(error?.response?.data?.msg);
    }
  };
  return (
    <Wrapper>
      <Form method="post" className="form">
        <Logo />
        <h4>login</h4>
        <FormRow type="email" name="email" />
        <FormRow type="password" name="password" />
        <SubmitBtn formBtn={false} />
        <button type="button" className="btn btn-block" onClick={loginDemoUser}>
          explore the app
        </button>
        <p>
          Not a member yet?
          <Link to="/register" className="member-btn">
            Register
          </Link>
        </p>
      </Form>
    </Wrapper>
  );
};
export default Login;
