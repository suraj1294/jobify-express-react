import { Outlet, redirect, useNavigate, useNavigation } from "react-router-dom";
import Wrapper from "../assets/wrappers/dashboard";
import { BigSidebar, Navbar, SmallSidebar, Loading } from "../components";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import axiosInstance from "../utils/custom-fetch";
import { toast } from "sonner";
import { QueryClient, useQuery } from "@tanstack/react-query";
import { checkDefaultTheme } from "../utils/check-default-theme";
import { User } from "../models/user";
const userQuery = {
  queryKey: ["user"],
  queryFn: async () => {
    const { data } = await axiosInstance.get("/auth/current-user");
    return data;
  },
};

export const loader = (queryClient: QueryClient) => async () => {
  try {
    return await queryClient.ensureQueryData(userQuery);
  } catch (error) {
    return redirect("/");
  }
};

type DashboardContextType = {
  user?: User;
  showSidebar?: boolean;
  isDarkTheme?: boolean;
  toggleDarkTheme?: () => void;
  toggleSidebar?: () => void;
  logoutUser?: () => void;
};

const DashboardContext = createContext<DashboardContextType>({});

const DashboardLayout = ({ queryClient }: { queryClient: QueryClient }) => {
  const { user } = useQuery(userQuery).data;
  const navigate = useNavigate();
  const navigation = useNavigation();
  const isPageLoading = navigation.state === "loading";
  const [showSidebar, setShowSidebar] = useState(false);
  const [isDarkTheme, setIsDarkTheme] = useState(checkDefaultTheme());
  const [isAuthError, setIsAuthError] = useState(false);

  const toggleDarkTheme = () => {
    const newDarkTheme = !isDarkTheme;
    setIsDarkTheme(newDarkTheme);
    document.body.classList.toggle("dark-theme", newDarkTheme);
    localStorage.setItem("darkTheme", String(newDarkTheme));
  };

  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };

  const logoutUser = useCallback(async () => {
    navigate("/");
    await axiosInstance.get("/auth/logout");
    queryClient.invalidateQueries();
    toast.success("Logging out...");
  }, [navigate, queryClient]);

  axiosInstance.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      if (error?.response?.status === 401) {
        setIsAuthError(true);
      }
      return Promise.reject(error);
    }
  );

  useEffect(() => {
    if (!isAuthError) return;
    logoutUser();
  }, [isAuthError, logoutUser]);

  return (
    <DashboardContext.Provider
      value={{
        user,
        showSidebar,
        isDarkTheme,
        toggleDarkTheme,
        toggleSidebar,
        logoutUser,
      }}
    >
      <Wrapper>
        <main className="dashboard">
          <SmallSidebar />
          <BigSidebar />
          <div>
            <Navbar />
            <div className="dashboard-page">
              {isPageLoading ? <Loading /> : <Outlet context={{ user }} />}
            </div>
          </div>
        </main>
      </Wrapper>
    </DashboardContext.Provider>
  );
};
export const useDashboardContext = () => useContext(DashboardContext);
export default DashboardLayout;
