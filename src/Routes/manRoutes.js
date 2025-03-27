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
import Qualifications from "views/TimesheetLog";
import Languages from "views/Languages";
import Roster from "views/Roster";
import Message from "views/Message";

const dashboardRoutes = [
  {
    name: "Reports",
    icon: "nc-icon nc-bullet-list-67",
    subMenu: [
      {
        path: "/employee-report",
        name: "Employee Report",
        component: EmployeeReport,
        layout: "/manager",
      },
      {
        path: "/client-report",
        name: "Client Report",
        component: ClientReport,
        layout: "/manager",
      },
      {
        path: "/client-summary",
        name: "Client Summary",
        component: ClientSummary,
        layout: "/manager",
      },
      {
        path: "/license-report",
        name: "License Report",
        component: LicenseReport,
        layout: "/manager",
      },
      {
        path: "/roster",
        name: "Roster View",
        component: Roster,
        layout: "/manager",
      },
    ],
  },
  {
    path: "/employee-list",
    name: "Employee List",
    icon: "nc-icon nc-notes",
    component: Employee,
    layout: "/manager",
  },
  {
    path: "/client-list",
    name: "Clients",
    icon: "nc-icon nc-circle-09",
    component: ClientName,
    layout: "/manager",
  },
  {
    path: "/timesheet",
    name: "Time Sheet",
    icon: "nc-icon nc-time-alarm",
    component: TimeSheet,
    layout: "/manager",
  },
  {
    path: "/companies",
    name: "Companies",
    icon: "nc-icon nc-support-17",
    component: Companies,
    layout: "/manager",
  },
  {
    name: "Settings",
    icon: "nc-icon nc-settings-gear-64",
    subMenu: [
      {
        path: "/location",
        name: "Location",
        component: Location,
        layout: "/manager",
      },
      {
        path: "/tasks",
        name: "Tasks",
        component: Tasks,
        layout: "/manager",
      },
      {
        path: "/events",
        name: "Events",
        component: Events,
        layout: "/manager",
      },
      {
        path: "/template",
        name: "Template",
        component: Template,
        layout: "/manager",
      },
      {
        path: "/license/form",
        name: "Form",
        component: Form,
        layout: "/manager",
      },
      {
        path: "/email/template",
        name: "Email Template",
        component: EmailTemplate,
        layout: "/manager",
      },
      {
        path: "/skills",
        name: "Skills",
        component: Skills,
        layout: "/manager",
      },
      {
        path: "/qualifications",
        name: "Qualifications",
        component: Qualifications,
        layout: "/manager",
      },
      {
        path: "/languages",
        name: "Languages",
        component: Languages,
        layout: "/manager",
      },
    ],
  },
  {
    path: "/notification/log",
    name: "Notification Log",
    icon: "nc-icon nc-bell-55",
    component: NotificationLog,
    layout: "/manager",
  },
  {
    path: "/timesheet/log",
    name: "Timesheet Log",
    icon: "nc-icon nc-single-copy-04",
    component: TimeSheetLog,
    layout: "/manager",
  },
  {
    path: "/schedule",
    name: "Schedule",
    icon: "nc-icon nc-grid-45",
    component: Schedule,
    layout: "/manager",
  },
  {
      path: "/messages",
      name: "Messages",
      icon: "nc-icon nc-email-85",
      component: Message,
      layout: "/manager",
    },
];

export default dashboardRoutes;
