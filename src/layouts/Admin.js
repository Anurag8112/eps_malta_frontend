import React from "react";
import { useLocation, Route, Routes } from "react-router-dom";
import AdminNavbar from "components/Navbars/AdminNavbar";
import Footer from "components/Footer/Footer";
import Sidebar from "components/Sidebar/Sidebar";
import EmployeeReport from "views/EmployeeReport.js";
import ClientReport from "views/ClientReport.js";
import Employee from "views/Employee.js";
import Location from "views/Location.js";
import Tasks from "views/Tasks.js";
import Events from "views/Events.js";
import TimeSheet from "views/TimeSheet.js";
import Template from "views/Template.js";
import routes from "../Routes/routes.js";
import sidebarImage from "assets/img/istock-983236090-1.webp";
import ChangePassword from "../components/ChangePassword/ChangePassword.js";
import ClientName from "views/Client.js";
import Form from "views/Froms.js";
import Companies from "views/Companies.js";
import LicenseReport from "views/LicenseReport.js";
import ClientSummary from "views/ClientSummary.js";
import EmailTemplate from "views/EmailTemplate.js";
import NotificationLog from "views/NotificationLog.js";
import AppSetting from "../components/AppSetting/AppSetting.js";
import Schedule from "views/Schedule.js";
import { useTokenInfo } from "../authRoutes/PrivateRoutes.js";
import TimeSheetLog from "views/TimesheetLog.js";
import Skills from "views/Skills.js";
import Qualifications from "views/Qualifications.js";
import Languages from "views/Languages.js";
import Roster from "views/Roster.js";
import Message from "views/Message.js";
function Admin() {
  const [image, setImage] = React.useState(sidebarImage);
  const [color, setColor] = React.useState("black");
  const [hasImage, setHasImage] = React.useState(true);
  const location = useLocation();
  const mainPanel = React.useRef(null);
  const { userEmail } = useTokenInfo();

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
              <Route
                path="/employee-report"
                element={<EmployeeReport />}
              ></Route>
              <Route path="/client-report" element={<ClientReport />}></Route>
              <Route path="/roster" element={<Roster />}></Route>
              <Route path="/employee-list" element={<Employee />}></Route>
              <Route path="/client-list" element={<ClientName />}></Route>
              <Route path="/location" element={<Location />}></Route>
              <Route path="/tasks" element={<Tasks />}></Route>
              <Route path="/events" element={<Events />}></Route>
              <Route path="/timesheet" element={<TimeSheet />}></Route>
              <Route path="/template" element={<Template />}></Route>
              <Route path="/skills" element={<Skills />}></Route>
              <Route
                path="/qualifications"
                element={<Qualifications />}
              ></Route>
              <Route path="/languages" element={<Languages />}></Route>
              {userEmail === "info@epsmalta.com" ? (
                <Route path="/companies" element={<Companies />}></Route>
              ) : null}
              <Route path="/license/form" element={<Form />}></Route>
              <Route path="/license-report" element={<LicenseReport />}></Route>
              <Route path="/client-summary" element={<ClientSummary />}></Route>
              <Route path="/email/template" element={<EmailTemplate />}></Route>
              <Route
                path="/notification/log"
                element={<NotificationLog />}
              ></Route>
              <Route path="/timesheet/log" element={<TimeSheetLog />}></Route>
              <Route path="/schedule" element={<Schedule />}></Route>
              <Route path="/messages" element={<Message />}></Route>
              <Route
                path="/change-password"
                element={<ChangePassword />}
              ></Route>
              <Route path="/app-setting" element={<AppSetting />}></Route>
            </Routes>
          </div>
          <Footer />
        </div>
      </div>
    </>
  );
}

export default Admin;
