import Wrapper from "../assets/wrappers/nav-bar";
import { FaAlignLeft } from "react-icons/fa";
import Logo from "./logo";
import { useDashboardContext } from "../pages/dashboard-layout";
import LogoutContainer from "./logout-container";
import ThemeToggle from "./theme-toggle";
const Navbar = () => {
  const { toggleSidebar } = useDashboardContext();
  return (
    <Wrapper>
      <div className="nav-center">
        <button type="button" className="toggle-btn" onClick={toggleSidebar}>
          <FaAlignLeft />
        </button>
        <div>
          <Logo />
          <h4 className="logo-text">dashboard</h4>
        </div>
        <div className="btn-container">
          <ThemeToggle />
          <LogoutContainer />
        </div>
      </div>
    </Wrapper>
  );
};
export default Navbar;
