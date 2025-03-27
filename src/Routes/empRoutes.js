import EmployeeReport from "views/EmployeeReport.js";
import TimeSheet from "views/TimeSheet";
import Schedule from "views/Schedule";
import Message from "views/Message";

const dashboardRoutes = [
  {
    path: "/employee-report",
    name: "Employee Report",
    icon: "nc-icon nc-chart-pie-35",
    component: EmployeeReport,
    layout: "/employee",
  },
  {
    path: "/timesheet",
    name: "Time Sheet",
    icon: "nc-icon nc-time-alarm",
    component: TimeSheet,
    layout: "/employee",
  },
  {
    path: "/schedule",
    name: "Schedule",
    icon: "nc-icon nc-grid-45",
    component: Schedule,
    layout: "/employee",
  }
];

export default dashboardRoutes;
