import React, { useEffect, useState } from "react";
import { Card, Container, Row, Col } from "react-bootstrap";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import resourceTimelinePlugin from "@fullcalendar/resource-timeline";
import interactionPlugin from "@fullcalendar/interaction";
import axios from "axios";
import moment from "moment";
import { useTokenInfo } from "authRoutes/PrivateRoutes.js";
import { TimeSheetModal } from "components/TimeSheet/TimeSheetModal";
import { TimeSheetViewModal } from "components/TimeSheet/TimeSheetModal";
import { toast, ToastContainer } from "react-toastify";
import { MultiSelect } from "react-multi-select-component";

function Schedule() {
  const [employeeData, setEmployeeData] = useState([]);
  const [sheetView, setSheetView] = useState({});
  const [dialogOpen, setDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [dateClickInfo, setDateClickInfo] = useState(null);
  const [calendarApi, setCalendarApi] = useState(null);
  const { userRole, userId } = useTokenInfo();
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [employeeFilterData, setEmployeeFilterData] = useState({
    locations: [],
  });
  const [selectedLocation, setSelectedLocation] = useState([]);
  const [location, setLocation] = useState("");

  useEffect(() => {
    fetchEmployeeDetails();
  }, []);

  useEffect(() => {
    fetchEmployeeData();
  }, [location]);

  const fetchEmployeeDetails = async () => {
    try {
      const response = await axios.get("timesheet/filter/employee/details");
      setEmployeeFilterData(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchEmployeeData = async () => {
    try {
      const params = {};
      if (location) params.locationId = location;

      const response = await axios.get("timesheet/employee/entryview", {
        params,
      });
      setEmployeeData(response.data.employees);
    } catch (error) {
      console.error("Error fetching employee data:", error);
    }
  };

  const onTimeSheetView = (eventInfo) => {
    setSheetView(eventInfo.event._def.extendedProps.fullEmployeeData);
    setViewDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setViewDialogOpen(false);
  };

  const handleLocationSelect = (selectedList) => {
    setSelectedLocation(selectedList);
    const formattedData = selectedList.map((item) => item.value);
    setLocation(formattedData);
  };

  const handleDatesSet = (arg) => {
    const start = moment(arg.startStr).format("YYYY-MM-DD");
    const end = moment(arg.endStr).subtract(1, "day").format("YYYY-MM-DD");

    // Filter employees based on date range
    let filtered = employeeData.filter((employee) => {
      const employeeDate = moment(employee.date, "YYYY-MM-DD");
      return employeeDate.isBetween(start, end, null, "[]"); // '[]' includes start and end dates
    });

    // If user role is '2', filter further based on userId
    if (userRole === "2") {
      filtered = filtered.filter((employee) => employee.employeeId === userId);
    }

    // Use a Set to ensure unique employee IDs
    const seenIds = new Set();
    const uniqueFormattedResources = filtered.reduce((acc, employee) => {
      if (!seenIds.has(employee.employeeId)) {
        seenIds.add(employee.employeeId);
        acc.push({
          id: employee.employeeId,
          title: employee.username,
        });
      }
      return acc;
    }, []);

    // Update the filteredEmployees state
    setFilteredEmployees(uniqueFormattedResources);
  };

  const events = employeeData.map((item) => ({
    title: `${moment(item.startTime, "HH:mm").format("hA")} - ${moment(
      item.endTime,
      "HH:mm"
    ).format("hA")} • ${item.hours}h • ${item.events} • ${item.location} • ${
      item.username
    }`,
    start: `${item.date}T${item.startTime}`,
    end: `${item.date}T${item.endTime}`,
    resourceId: item.employeeId,
    backgroundColor: item.eventColor,
    fullEmployeeData: item,
    display: item.eventColor,
  }));

  const handleDateClick = (info) => {
    if (userRole === "1" || userRole === "3") {
      setDateClickInfo(info);
      setDialogOpen(true);
    }
  };

  const handleSendNotification = async () => {
    if (!calendarApi) {
      return toast.error("Calendar API not available.");
    }

    const viewTypeMapping = {
      dayGridMonth: "month",
      resourceTimelineWeek: "week",
      resourceTimelineDay: "day",
    };

    const { view } = calendarApi;
    const viewType = viewTypeMapping[view.type] || "unknown";
    const viewStart = moment(view.currentStart);

    let start;
    let end;

    if (viewType === "month") {
      start = viewStart.startOf("month").format("YYYY-MM-DD");
      end = viewStart.endOf("month").format("YYYY-MM-DD");
    } else if (viewType === "week" || viewType === "day") {
      start = moment(view.activeStart).format("YYYY-MM-DD");
      end = moment(view.activeEnd).subtract(1, "day").format("YYYY-MM-DD");
    }

    const selectedLocationIds = selectedLocation.map((loc) => loc.value);

    try {
      await axios.post("timesheet/notifications/send", {
        startDate: start,
        endDate: end,
        type: viewType,
        locationIds: selectedLocationIds,
      });
      toast.success("Notifications sent successfully!");
    } catch (error) {
      console.error("Error sending notifications:", error);
      toast.error("Error sending notifications.");
    }
  };

  return (
    <>
      <Container fluid>
        <Row>
          <Col md={12}>
            <Row className="mb-2">
              <Col md="4">
                <MultiSelect
                  options={employeeFilterData.locations.map((employee) => ({
                    label: employee.location,
                    value: employee.id,
                  }))}
                  value={selectedLocation}
                  onChange={(selectedOptions) =>
                    handleLocationSelect(selectedOptions)
                  }
                  labelledBy={"Select an option"}
                />
              </Col>
            </Row>
            <Card className="stripped-table-with-hover">
              <Card.Body className="table-full-width table-responsive px-0">
                <FullCalendar
                  plugins={[
                    dayGridPlugin,
                    resourceTimelinePlugin,
                    interactionPlugin,
                  ]}
                  initialView="dayGridMonth"
                  events={events}
                  eventClick={onTimeSheetView}
                  dateClick={handleDateClick}
                  datesSet={handleDatesSet}
                  height={600}
                  firstDay={1}
                  headerToolbar={{
                    left: "prev,next today",
                    center: "title",
                    right:
                      "sendNotifications dayGridMonth,resourceTimelineWeek,resourceTimelineDay",
                  }}
                  customButtons={{
                    sendNotifications: {
                      text: "Publish",
                      click: () => {
                        handleSendNotification();
                      },
                    },
                  }}
                  views={{
                    resourceTimelineDay: {
                      type: "resourceTimeline",
                      duration: { days: 1 },
                    },
                    resourceTimelineWeek: {
                      type: "resourceTimeline",
                      duration: { weeks: 1 },
                      slotDuration: "1 day",
                      slotLabelInterval: { days: 1 },
                      slotLabelFormat: { day: "numeric", weekday: "short" },
                    },
                    dayGridMonth: {
                      type: "dayGridMonth",
                    },
                  }}
                  resources={filteredEmployees}
                  displayEventTime={false}
                  resourceAreaWidth="25%"
                  resourceAreaHeaderContent="SCHEDULED SHIFTS"
                  ref={(calendar) => {
                    if (calendar) {
                      setCalendarApi(calendar.getApi());
                    }
                  }}
                />
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
      <TimeSheetModal
        show={dialogOpen}
        handleClose={handleDialogClose}
        onSaveCallBack={fetchEmployeeData}
        dateClickInfo={dateClickInfo}
      />
      <TimeSheetViewModal
        show={viewDialogOpen}
        handleClose={handleDialogClose}
        sheetView={sheetView}
      />
      <ToastContainer position="top-center" autoClose={3000} hideProgressBar />
    </>
  );
}

export default Schedule;
