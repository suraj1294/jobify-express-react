import { FaTimes } from "react-icons/fa";
import Wrapper from "../assets/wrappers/small-sidebar";
import { useDashboardContext } from "../pages/dashboard-layout";
import Logo from "./logo";

import NavLinks from "./nav-links";
const SmallSidebar = () => {
  const { showSidebar, toggleSidebar } = useDashboardContext();

  return (
    <Wrapper>
      <div
        className={
          showSidebar ? "sidebar-container show-sidebar" : "sidebar-container"
        }
      >
        <div className="content">
          <button type="button" className="close-btn" onClick={toggleSidebar}>
            <FaTimes />
          </button>
          <header>
            <Logo />
          </header>
          <NavLinks isBigSidebar={false} />
        </div>
      </div>
    </Wrapper>
  );
};
export default SmallSidebar;
