import EmployeeReport from "views/EmployeeReport.js";
import ClientReport from "views/ClientReport.js";
import Employee from "views/Employee.js";
import Location from "views/Location.js";
import Tasks from "views/Tasks.js";
import Events from "views/Events.js";
import TimeSheet from "views/TimeSheet.js";
import ClientName from "views/Client.js";
import Template from "views/Template.js";
import Form from "views/Froms.js";
import LicenseReport from "views/LicenseReport";
import ClientSummary from "views/ClientSummary";
import EmailTemplate from "views/EmailTemplate";
import Companies from "views/Companies";
import NotificationLog from "views/NotificationLog";
import Schedule from "views/Schedule";
import TimeSheetLog from "views/TimesheetLog";
import Skills from "views/Skills";
import Qualifications from "views/Qualifications";
import Languages from "views/Languages";
import Roster from "views/Roster";

const dashboardRoutes = [
  {
    name: "Reports",
    icon: "nc-icon nc-bullet-list-67",
    subMenu: [
      {
        path: "/employee-report",
        name: "Employee Report",
        component: EmployeeReport,
        layout: "/admin",
      },
      {
        path: "/client-report",
        name: "Client Report",
        component: ClientReport,
        layout: "/admin",
      },
      {
        path: "/client-summary",
        name: "Client Summary",
        component: ClientSummary,
        layout: "/admin",
      },
      {
        path: "/license-report",
        name: "License Report",
        component: LicenseReport,
        layout: "/admin",
      },
      {
        path: "/roster",
        name: "Roster View",
        component: Roster,
        layout: "/admin",
      },
    ],
  },
  {
    path: "/employee-list",
    name: "Employee List",
    icon: "nc-icon nc-notes",
    component: Employee,
    layout: "/admin",
  },
  {
    path: "/client-list",
    name: "Clients",
    icon: "nc-icon nc-circle-09",
    component: ClientName,
    layout: "/admin",
  },
  {
    path: "/timesheet",
    name: "Time Sheet",
    icon: "nc-icon nc-time-alarm",
    component: TimeSheet,
    layout: "/admin",
  },
  {
    path: "/companies",
    name: "Companies",
    icon: "nc-icon nc-support-17",
    component: Companies,
    layout: "/admin",
  },
  {
    name: "Settings",
    icon: "nc-icon nc-settings-gear-64",
    subMenu: [
      {
        path: "/location",
        name: "Location",
        component: Location,
        layout: "/admin",
      },
      {
        path: "/tasks",
        name: "Tasks",
        component: Tasks,
        layout: "/admin",
      },
      {
        path: "/events",
        name: "Events",
        component: Events,
        layout: "/admin",
      },
      {
        path: "/template",
        name: "Template",
        component: Template,
        layout: "/admin",
      },
      {
        path: "/license/form",
        name: "Form",
        component: Form,
        layout: "/admin",
      },
      {
        path: "/email/template",
        name: "Email Template",
        component: EmailTemplate,
        layout: "/admin",
      },
      {
        path: "/skills",
        name: "Skills",
        component: Skills,
        layout: "/admin",
      },
      {
        path: "/qualifications",
        name: "Qualifications",
        component: Qualifications,
        layout: "/admin",
      },
      {
        path: "/languages",
        name: "Languages",
        component: Languages,
        layout: "/admin",
      },
    ],
  },
  {
    path: "/notification/log",
    name: "Notification Log",
    icon: "nc-icon nc-bell-55",
    component: NotificationLog,
    layout: "/admin",
  },
  {
    path: "/timesheet/log",
    name: "Timesheet Log",
    icon: "nc-icon nc-single-copy-04",
    component: TimeSheetLog,
    layout: "/admin",
  },
  {
    path: "/schedule",
    name: "Schedule",
    icon: "nc-icon nc-grid-45",
    component: Schedule,
    layout: "/admin",
  },
];

export default dashboardRoutes;
