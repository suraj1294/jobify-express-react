import { BsFillSunFill, BsFillMoonFill } from "react-icons/bs";
import Wrapper from "../assets/wrappers/theme-toggle";
import { useDashboardContext } from "../pages/dashboard-layout";

const ThemeToggle = () => {
  const { isDarkTheme, toggleDarkTheme } = useDashboardContext();
  return (
    <Wrapper onClick={toggleDarkTheme}>
      {isDarkTheme ? (
        <BsFillSunFill className="toggle-icon" />
      ) : (
        <BsFillMoonFill />
      )}
    </Wrapper>
  );
};
export default ThemeToggle;
