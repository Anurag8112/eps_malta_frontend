import React from "react";
import { useLocation, Route, Routes } from "react-router-dom";
import AdminNavbar from "components/Navbars/AdminNavbar";
import Footer from "components/Footer/Footer";
import Sidebar from "components/Sidebar/Sidebar";
import EmployeeReport from "views/EmployeeReport.js";
import routes from "../Routes/empRoutes.js";
import sidebarImage from "assets/img/istock-983236090-1.webp";
import ChangePassword from "../components/ChangePassword/ChangePassword.js";
import TimeSheet from "views/TimeSheet.js";
import Schedule from "views/Schedule.js";

function EmployeeLayout() {
  const [image, setImage] = React.useState(sidebarImage);
  const [color, setColor] = React.useState("black");
  const [hasImage, setHasImage] = React.useState(true);
  const location = useLocation();
  const mainPanel = React.useRef(null);

  React.useEffect(() => {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
    mainPanel.current.scrollTop = 0;
    if (
      window.innerWidth < 993 &&
      document.documentElement.className.indexOf("nav-open") !== -1
    ) {
      document.documentElement.classList.toggle("nav-open");
      var element = document.getElementById("bodyClick");
      element.parentNode.removeChild(element);
    }
  }, [location]);
  return (
    <>
      <div className="wrapper">
        <Sidebar color={color} image={hasImage ? image : ""} routes={routes} />
        <div className="main-panel" ref={mainPanel}>
          <AdminNavbar />
          <div className="content">
            <Routes>
              <Route path="/employee-report" element={<EmployeeReport />}></Route>
              <Route path="/timesheet" element={<TimeSheet />}></Route>
              <Route path="/schedule" element={<Schedule />}></Route>
              <Route
                path="/change-password"
                element={<ChangePassword />}
              ></Route>
            </Routes>
          </div>
          <Footer />
        </div>
      </div>
    </>
  );
}

export default EmployeeLayout;
