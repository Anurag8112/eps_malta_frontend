import React, { useEffect, useState } from "react";
import {
  Card,
  Container,
  Row,
  Col,
  Table,
  Form,
  Button,
  Spinner,
} from "react-bootstrap";
import axios from "axios";
import moment from "moment";
import ReactPaginate from "react-paginate";
import { Link } from "react-router-dom";
import { TimeSheetModal } from "../components/TimeSheet/TimeSheetModal";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useTokenInfo } from "../authRoutes/PrivateRoutes.js";
import { MultiSelect } from "react-multi-select-component";
import { FileText } from "react-bootstrap-icons";
import { Tooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";

function EmployeeReport() {
  const { userRole, userId } = useTokenInfo();
  const currentYear = moment().format("YYYY");
  const currentMonth = moment().format("MMM");

  const [reportData, setReportData] = useState([]);
  const [grandTotal, setGrandTotal] = useState({ shift: 0, hours: 0, cost: 0 });
  const [years, setYears] = useState(currentYear);
  const [months, setMonths] = useState(currentMonth);
  const [location, setLocation] = useState("");
  const [event, setEvent] = useState("");
  const [task, setTask] = useState("");
  const [clientId, setClientId] = useState("");
  const [rate, setRate] = useState("");
  const [ratePerHour, setRatePerHour] = useState("");
  const [titleId, setTitleId] = useState("");
  const [employeeId, setEmployeeId] = useState("");
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isSendingMail, setIsSendingMail] = useState(false);
  const [isDownloadingExcel, setIsDownloadingExcel] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState();
  const [perPage, setPerPage] = useState(100);
  const [employeeData, setEmployeeData] = useState({
    locations: [],
    events: [],
    tasks: [],
    month: [],
    year: [],
    client: [],
    title: [],
    year: [],
    employee: [],
    ratePerHour: [],
  });
  const [dialogOpen, setDialogOpen] = useState(false);
  const [sheetEdit, setSheetEdit] = useState({});
  const [selected, setSelected] = useState([]);
  const [selectedRatePerHours, setSelectedRatePerHours] = useState([]);

  const [currentFilter, setCurrentFilter] = useState(null);

  const onTimeSheetEdit = (sheetEdit) => {
    setSheetEdit(sheetEdit);
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  const fetchReportData = async () => {
    try {
      setIsLoading(true);

      const params = {};
      if (years) params.year = years;
      if (months) params.month = months;
      if (location) params.locationId = location;
      if (event) params.eventId = event;
      if (task) params.taskId = task;
      if (userRole === "2" ? userId : employeeId) {
        params.employeeId = userRole === "2" ? userId : employeeId;
      }
      if (rate) params.rate = rate;
      if (ratePerHour) params.ratePerHour = ratePerHour;
      if (clientId) params.clientId = clientId;
      if (page) params.page = page;
      if (perPage) params.perPage = perPage;

      const response = await axios.get("timesheet/employee/report", {
        params, // Pass the params as an object here
      });

      const { reports, grandTotal, pagination } = response.data;
      setReportData(reports);
      setGrandTotal(grandTotal);
      setTotalPages(pagination.totalPages);
      setError(null);
    } catch (error) {
      if (error.response && error.response.status === 404) {
        console.error(
          "Error 404: Data not found according to the filter criteria:",
          error
        );
        setError("Your according filter data not available!");
      } else {
        console.error("Error retrieving employee data:", error);
        setError("Data Not Found!");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const fetchEmployeeDetails = async () => {
    try {
      const params = {};
      if (years) params.year = years;
      if (months) params.month = months;
      if (location) params.locationId = location;
      if (event) params.eventId = event;
      if (task) params.taskId = task;
      if (userRole === "2" ? userId : employeeId) {
        params.employeeId = userRole === "2" ? userId : employeeId;
      }
      if (rate) params.rate = rate;
      if (ratePerHour) params.ratePerHour = ratePerHour;
      if (clientId) params.clientId = clientId;

      const response = await axios.get("timesheet/filter/employee/details", {
        params,
      });
      const newData = response.data;

      // Update the state with new data, preserving the part related to selectKey
      setEmployeeData((prevData) => {
        const mergedData = { ...prevData, ...newData };

        // Preserve the selectKey part to keep previous data
        if (currentFilter) {
          // If currentFilter is one of the arrays to be preserved, don't update it with new data
          if (
            [
              "locations",
              "events",
              "tasks",
              "month",
              "year",
              "client",
              "title",
              "employee",
              "ratePerHour",
            ].includes(currentFilter)
          ) {
            mergedData[currentFilter] = prevData[currentFilter];
          }
        }

        return mergedData;
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];

    const formData = new FormData();
    formData.append("file", file);

    try {
      setIsImporting(true);
      await axios.post("timesheet/employee/addfromexcel", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      toast.success("File uploaded successfully");
      fetchEmployeeDetails();
      fetchReportData();
      // Handle success, if needed
    } catch (error) {
      console.error("Upload error:", error.message);
      if (error.response && error.response.data && error.response.data.error) {
        toast.error(`Upload failed: ${error.response.data.error}`);
      } else {
        toast.error("Upload failed. Please try again later.");
      }
    } finally {
      setIsImporting(false);
      // Clear the file input (reset)
      event.target.value = null;
    }
  };

  const handleEmployeeSelect = (selectedList) => {
    setSelected(selectedList);
    const formattedData = selectedList.map((item) => item.value);
    setEmployeeId(formattedData);
    setPage(1);
  };

  const handleRatePerHoursSelect = (selectedList) => {
    setSelectedRatePerHours(selectedList);
    const formattedData = selectedList.map((item) => item.value);
    setRatePerHour(formattedData);
    setPage(1);
  };

  // Function to clear all filters
  const handleClearFilters = () => {
    setYears(currentYear);
    setMonths(currentMonth);
    setLocation("");
    setEvent("");
    setTask("");
    if (userRole === "1") {
      setEmployeeId("");
      setSelected([]);
    }
    setRate("");
    setRatePerHour("");
    setSelectedRatePerHours([]);
    setClientId("");
    setPage(1);
    fetchEmployeeDetails();
  };

  const handleDownloadAndSend = async (action) => {
    try {
      const params = new URLSearchParams({
        year: years,
        month: months,
        locationId: location,
        eventId: event,
        taskId: task,
        employeeId,
        rate,
        titleId,
        ratePerHour,
        clientId,
        page,
        perPage,
        action,
      });

      if (action === "download") {
        setIsDownloading(true);
        const response = await axios.get("timesheet/employee/report-pdf", {
          params: params,
          responseType: "blob", // Set the responseType to "blob" to indicate a binary response
        });

        let fileName;
        let mimeType;
        const contentType = response.headers["content-type"];

        if (contentType === "application/pdf") {
          fileName = "report.pdf";
          mimeType = "application/pdf";
        } else if (contentType === "application/zip") {
          fileName = "report.zip";
          mimeType = "application/zip";
        } else {
          // Handle other file types if needed
          toast.error("Unsupported file type!");
          setIsDownloading(false);
          return;
        }

        // Create a URL for the blob response
        const url = window.URL.createObjectURL(
          new Blob([response.data], { type: mimeType })
        );

        // Create a link element to trigger the download
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", fileName);
        document.body.appendChild(link);

        // Trigger the download
        link.click();

        // Clean up the URL object
        window.URL.revokeObjectURL(url);

        setIsDownloading(false);
        toast.success("File download successfully!");
      } else if (action === "send") {
        setIsSendingMail(true);
        await axios.get("timesheet/employee/report-pdf", {
          params: params,
        });
        toast.success("Email sent successfully!");
      } else if (action === "download-excel") {
        setIsDownloadingExcel(true);
        const response = await axios.get("timesheet/employee/report-excel", {
          params: params,
          responseType: "blob", // Set the responseType to "blob" to indicate a binary response
        });

        const fileName = "timesheet.xlsx";
        const mimeType =
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";

        // Create a URL for the blob response
        const url = window.URL.createObjectURL(
          new Blob([response.data], { type: mimeType })
        );

        // Create a link element to trigger the download
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", fileName);
        document.body.appendChild(link);

        // Trigger the download
        link.click();

        // Clean up the URL object
        window.URL.revokeObjectURL(url);

        setIsDownloadingExcel(false);
        toast.success("Excel file downloaded successfully!");
      }
    } catch (error) {
      console.error("Error retrieving employee data:", error);
      if (action === "download" || action === "download-excel") {
        toast.error("Failed to download report.");
      } else {
        toast.error("Email not sent.");
      }
    } finally {
      setIsDownloading(false);
      setIsSendingMail(false);
    }
  };

  const handleExcelTemplateDownload = async () => {
    try {
      // Make the API call to download the file
      const response = await axios.get(
        "timesheet/employee/report-excel/template",
        {
          responseType: "blob", // Important for file download
        }
      );

      // Create a URL for the blob response
      const url = window.URL.createObjectURL(
        new Blob([response.data], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        })
      );

      // Create a link element to trigger the download
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "timesheet_template.xlsx");
      document.body.appendChild(link);

      // Trigger the download
      link.click();

      // Clean up the URL object
      window.URL.revokeObjectURL(url);
      document.body.removeChild(link);
      toast.success("Timesheet template download successfully!");
    } catch (error) {
      console.error("Error downloading the file:", error);
      toast.error("Error downloading the timesheet template:", error);
    }
  };

  useEffect(() => {
    fetchEmployeeDetails();
  }, [
    years,
    months,
    location,
    event,
    task,
    employeeId,
    rate,
    ratePerHour,
    clientId,
  ]);

  useEffect(() => {
    fetchReportData();
  }, [
    years,
    months,
    location,
    event,
    task,
    employeeId,
    rate,
    ratePerHour,
    clientId,
    page,
    perPage,
  ]);

  const handleChangePerPage = (e) => {
    setPerPage(parseInt(e.target.value));
    setPage(1);
  };

  const handleChangePage = (page) => {
    setPage(page);
  };

  const titleType = employeeData?.title?.find(
    (resp) => resp?.id == titleId
  )?.type;

  const showExportCsvButton = titleType !== "timesheet";
  const showEmployeeTemplateButton = titleType !== "employee";

  return (
    <>
      <Container fluid>
        <Row>
          <Col md={12}>
            <Row className="mb-2">
              <Col md="2">
                <Form.Group>
                  <Form.Control
                    as="select"
                    name="locationId"
                    className="form-control-filter"
                    value={years}
                    onChange={(e) => {
                      setYears(e.target.value);
                      setCurrentFilter("year");
                    }}
                  >
                    <option value="">Years</option>
                    {employeeData.year.map((year) => (
                      <option key={year.year} value={year.year}>
                        {year.year}
                      </option>
                    ))}
                  </Form.Control>
                </Form.Group>
              </Col>
              <Col md="2">
                <Form.Group>
                  <Form.Control
                    as="select"
                    name="month"
                    className="form-control-filter"
                    value={months}
                    onChange={(e) => {
                      setMonths(e.target.value);
                      setCurrentFilter("month");
                    }}
                  >
                    <option value="">Months</option>
                    {employeeData.month.map((month) => (
                      <option key={month.month} value={month.month}>
                        {month.month}
                      </option>
                    ))}
                  </Form.Control>
                </Form.Group>
              </Col>
              <Col md="2">
                <Form.Group>
                  <Form.Control
                    as="select"
                    name="location"
                    className="form-control-filter"
                    value={location}
                    onChange={(e) => {
                      setLocation(e.target.value);
                      setCurrentFilter("locations");
                    }}
                  >
                    <option value="">Location</option>
                    {employeeData.locations.map((location) => (
                      <option key={location.id} value={location.id}>
                        {location.location}
                      </option>
                    ))}
                  </Form.Control>
                </Form.Group>
              </Col>
              <Col md="2">
                <Form.Group>
                  <Form.Control
                    as="select"
                    name="event"
                    className="form-control-filter"
                    value={event}
                    onChange={(e) => {
                      setEvent(e.target.value);
                      setCurrentFilter("events");
                    }}
                  >
                    <option value="">Events</option>
                    {employeeData.events.map((event) => (
                      <option key={event.id} value={event.id}>
                        {event.events}
                      </option>
                    ))}
                  </Form.Control>
                </Form.Group>
              </Col>
              <Col md="2">
                <Form.Group>
                  <Form.Control
                    as="select"
                    name="task"
                    className="form-control-filter"
                    value={task}
                    onChange={(e) => {
                      setTask(e.target.value);
                      setCurrentFilter("tasks");
                    }}
                  >
                    <option value="">Tasks</option>
                    {employeeData.tasks.map((task) => (
                      <option key={task.id} value={task.id}>
                        {task.tasks}
                      </option>
                    ))}
                  </Form.Control>
                </Form.Group>
              </Col>
              <Col md="2">
                <Form.Group>
                  <Form.Control
                    as="select"
                    name="rate"
                    className="form-control-filter"
                    value={rate}
                    onChange={(e) => setRate(e.target.value)}
                  >
                    <option value="">Rate Type</option>
                    <option value="normal">Normal</option>
                    <option value="double">Double</option>
                  </Form.Control>
                </Form.Group>
              </Col>
            </Row>
            <Row className="mb-2">
              <Col md="3">
                <MultiSelect
                  options={employeeData.ratePerHour.map((ratePerHour) => ({
                    label: ratePerHour.ratePerHour,
                    value: ratePerHour.ratePerHour,
                  }))}
                  value={selectedRatePerHours}
                  onChange={(selectedOptions) => {
                    handleRatePerHoursSelect(selectedOptions);
                    setCurrentFilter("ratePerHour");
                  }}
                  labelledBy={"Select"}
                />
              </Col>
              {(userRole === "1" || userRole === "3") && (
                <>
                  <Col md="4">
                    <MultiSelect
                      options={employeeData.employee.map((employee) => ({
                        label: employee.employee,
                        value: employee.id,
                      }))}
                      value={selected}
                      onChange={(selectedOptions) => {
                        handleEmployeeSelect(selectedOptions);
                        setCurrentFilter("employee");
                      }}
                      labelledBy={"Select"}
                    />
                  </Col>
                  <Col md="3">
                    <Form.Group>
                      <Form.Control
                        as="select"
                        name="clientName"
                        className="form-control-filter"
                        value={clientId}
                        onChange={(e) => {
                          setClientId(e.target.value);
                          setCurrentFilter("client");
                        }}
                      >
                        <option value="">Client Name</option>
                        {employeeData.client.map((client) => (
                          <option key={client.id} value={client.id}>
                            {client.client}
                          </option>
                        ))}
                      </Form.Control>
                    </Form.Group>
                  </Col>
                </>
              )}
              <Col md="2">
                <Button
                  className="btn-info filter-btn"
                  onClick={handleClearFilters}
                >
                  CLEAR
                </Button>
              </Col>
            </Row>
            <Card className="stripped-table-with-hover">
              <Card.Header className="d-flex align-items-center justify-content-between">
                <div>
                  <Card.Title as="h4">Employee Reports</Card.Title>
                  <p className="card-category">Show All Reports</p>
                </div>
                <div className="d-flex align-items-center">
                  <Form.Group as={Col} className="me-3">
                    <Form.Control
                      as="select"
                      name="title"
                      className="form-control-filter"
                      value={titleId}
                      onChange={(e) => setTitleId(e.target.value)}
                      required
                    >
                      <option value="">Select Template</option>
                      {employeeData.title.map((title) => {
                        if (
                          title.type === "timesheet" &&
                          (userRole === "1" || userRole === "3")
                        ) {
                          return (
                            <option key={title.id} value={title.id}>
                              {title.title}
                            </option>
                          );
                        } else if (title.type === "employee") {
                          return (
                            <option key={title.id} value={title.id}>
                              {title.title}
                            </option>
                          );
                        }
                        return null; // Skip rendering for other cases
                      })}
                    </Form.Control>
                  </Form.Group>
                  <Button
                    onClick={() => handleDownloadAndSend("download")}
                    disabled={showEmployeeTemplateButton || isDownloading}
                    size="sm"
                  >
                    {isDownloading ? (
                      <>
                        <Spinner
                          as="span"
                          animation="border"
                          size="sm"
                          role="status"
                          aria-hidden="true"
                        />{" "}
                        <span className="visually-hidden">Downloading..</span>
                      </>
                    ) : (
                      "DOWNLOAD"
                    )}
                  </Button>
                  <Button
                    onClick={() => handleDownloadAndSend("send")}
                    disabled={showEmployeeTemplateButton || isSendingMail}
                    size="sm"
                    className="ml-1"
                  >
                    {isSendingMail ? (
                      <>
                        <Spinner
                          as="span"
                          animation="border"
                          size="sm"
                          role="status"
                          aria-hidden="true"
                        />{" "}
                        <span className="visually-hidden">Sending..</span>
                      </>
                    ) : (
                      "SEND MAIL"
                    )}
                  </Button>
                  {(userRole === "1" || userRole === "3") && (
                    <>
                      <Button
                        onClick={() => handleDownloadAndSend("download-excel")}
                        disabled={showExportCsvButton || isDownloadingExcel}
                        size="sm"
                        className="ml-1"
                      >
                        {isDownloadingExcel ? (
                          <>
                            <Spinner
                              as="span"
                              animation="border"
                              size="sm"
                              role="status"
                              aria-hidden="true"
                            />{" "}
                            <span className="visually-hidden">
                              Exporting...
                            </span>
                          </>
                        ) : (
                          "EXPORT"
                        )}
                      </Button>
                      <input
                        type="file"
                        accept=".csv, .xls, .xlsx"
                        onChange={handleFileUpload}
                        style={{ display: "none" }}
                        id="file-upload"
                      />
                      <label htmlFor="file-upload" className="ml-1">
                        <Button
                          size="sm"
                          as="span"
                          style={{ marginTop: "5px" }}
                        >
                          {isImporting ? (
                            <>
                              <Spinner
                                as="span"
                                animation="border"
                                size="sm"
                                role="status"
                                aria-hidden="true"
                              />{" "}
                              <span className="visually-hidden">
                                Importing...
                              </span>
                            </>
                          ) : (
                            "IMPORT"
                          )}{" "}
                        </Button>
                      </label>
                      <div
                        style={{ cursor: "pointer" }}
                        onClick={handleExcelTemplateDownload}
                        data-tooltip-id="my-tooltip"
                      >
                        <FileText size={30} />
                      </div>

                      <Tooltip
                        id="my-tooltip"
                        place="top"
                        content="Sample Excel"
                        />
                    </>
                  )}
                </div>
              </Card.Header>
              <Card.Body
                className="table-responsive px-0"
                style={{ overflowX: "auto" }}
              >
                {isLoading ? (
                  <div style={{ textAlign: "center" }}>
                    <Spinner animation="border" role="status" />
                  </div>
                ) : error ? (
                  <p className="card-category text-center">{error}</p>
                ) : (
                  <Table responsive>
                    <thead>
                      <tr>
                        <td colSpan="12">
                          <b>Grand Total</b>
                        </td>
                        <td>
                          <b>{grandTotal.shift}</b>
                        </td>
                        <td>
                          <b>{grandTotal.hours?.toFixed(2)}</b>
                        </td>
                        <td>
                          <b>{grandTotal.cost?.toFixed(2)}</b>
                        </td>
                      </tr>
                      <tr className="table-secondary">
                        <th>Name</th>
                        <th>Rate</th>
                        <th>Year</th>
                        <th>Month</th>
                        <th>R.P.H</th>
                        <th>Date</th>
                        <th>Location</th>
                        <th>Event</th>
                        <th>Task</th>
                        <th>ID</th>
                        <th>Start</th>
                        <th>End</th>
                        <th>Shift</th>
                        <th>Hours</th>
                        <th>Cost</th>
                      </tr>
                    </thead>
                    <tbody>
                      {reportData.map((report) => (
                        <React.Fragment key={report.username}>
                          {report.records.map((rateWise, rateIndex) => (
                            <React.Fragment key={rateWise.rate}>
                              {rateWise.records.map((yearWise, yearIndex) => (
                                <React.Fragment key={yearWise.year}>
                                  {yearWise.records.map(
                                    (monthWise, monthIndex) => (
                                      <React.Fragment key={monthWise.month}>
                                        {monthWise.records.map(
                                          (
                                            ratePerHourWise,
                                            ratePerHourIndex
                                          ) => (
                                            <React.Fragment
                                              key={ratePerHourWise.ratePerHour}
                                            >
                                              {ratePerHourWise.records.map(
                                                (item, index) => (
                                                  <tr key={item.timesheet_id}>
                                                    <td>
                                                      {index === 0 &&
                                                      yearIndex === 0 &&
                                                      monthIndex === 0 &&
                                                      ratePerHourIndex === 0 &&
                                                      rateIndex === 0
                                                        ? report.username
                                                        : ""}
                                                    </td>
                                                    <td>
                                                      {index === 0 &&
                                                      yearIndex === 0 &&
                                                      ratePerHourIndex === 0 &&
                                                      monthIndex === 0
                                                        ? rateWise.rate ===
                                                          "normal"
                                                          ? "Normal"
                                                          : "Double"
                                                        : ""}
                                                    </td>

                                                    <td>
                                                      {monthIndex === 0 &&
                                                      ratePerHourIndex === 0 &&
                                                      index === 0
                                                        ? yearWise.year
                                                        : ""}
                                                    </td>
                                                    <td>
                                                      {index === 0 &&
                                                      ratePerHourIndex === 0
                                                        ? monthWise.month
                                                        : ""}
                                                    </td>
                                                    <td>
                                                      {index === 0
                                                        ? Number(
                                                            ratePerHourWise.ratePerHour
                                                          ).toFixed(2)
                                                        : ""}
                                                    </td>
                                                    <td>
                                                      {moment(item.date).format(
                                                        "DD/MM/YYYY"
                                                      )}
                                                    </td>
                                                    <td>{item.location}</td>
                                                    <td>{item.event}</td>
                                                    <td>{item.task}</td>
                                                    <td>
                                                      <div className="hover-effect">
                                                        {userRole === "1" ? (
                                                          <Link
                                                            onClick={() =>
                                                              onTimeSheetEdit(
                                                                item
                                                              )
                                                            }
                                                          >
                                                            <b>
                                                              {
                                                                item.timesheet_id
                                                              }
                                                            </b>
                                                          </Link>
                                                        ) : (
                                                          <b>
                                                            {item.timesheet_id}
                                                          </b>
                                                        )}
                                                      </div>
                                                    </td>

                                                    <td>
                                                      {moment(
                                                        item.startTime,
                                                        "HH:mm"
                                                      ).format("HH:mm")}
                                                    </td>
                                                    <td>
                                                      {moment(
                                                        item.endTime,
                                                        "HH:mm"
                                                      ).format("HH:mm")}
                                                    </td>
                                                    <td>{"1"}</td>
                                                    <td>{item.hours}</td>
                                                    <td>{item.cost}</td>
                                                  </tr>
                                                )
                                              )}
                                              <tr>
                                                <td></td>
                                                <td></td>
                                                <td></td>
                                                <td></td>
                                                <td>
                                                  {ratePerHourWise.ratePerHour}{" "}
                                                  Total
                                                </td>
                                                <td></td>
                                                <td></td>
                                                <td></td>
                                                <td></td>
                                                <td></td>
                                                <td></td>
                                                <td></td>
                                                <td>
                                                  <b>
                                                    {
                                                      ratePerHourWise.total
                                                        .shift
                                                    }
                                                  </b>
                                                </td>
                                                <td>
                                                  <b>
                                                    {ratePerHourWise.total.hours.toFixed(
                                                      2
                                                    )}
                                                  </b>
                                                </td>
                                                <td>
                                                  <b>
                                                    {ratePerHourWise.total.cost.toFixed(
                                                      2
                                                    )}
                                                  </b>
                                                </td>
                                              </tr>
                                            </React.Fragment>
                                          )
                                        )}
                                        <tr>
                                          <td></td>
                                          <td></td>
                                          <td></td>
                                          <td>{monthWise.month} Total</td>
                                          <td></td>
                                          <td></td>
                                          <td></td>
                                          <td></td>
                                          <td></td>
                                          <td></td>
                                          <td></td>
                                          <td></td>
                                          <td>
                                            <b>{monthWise.total.shift}</b>
                                          </td>
                                          <td>
                                            <b>
                                              {monthWise.total.hours?.toFixed(
                                                2
                                              )}
                                            </b>
                                          </td>
                                          <td>
                                            <b>
                                              {monthWise.total.cost?.toFixed(2)}
                                            </b>
                                          </td>
                                        </tr>
                                      </React.Fragment>
                                    )
                                  )}
                                  <tr>
                                    <td></td>
                                    <td></td>
                                    <td>{yearWise.year} Total</td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td>
                                      <b>{yearWise.total.shift}</b>
                                    </td>
                                    <td>
                                      <b>{yearWise.total.hours?.toFixed(2)}</b>
                                    </td>
                                    <td>
                                      <b>{yearWise.total.cost?.toFixed(2)}</b>
                                    </td>
                                  </tr>
                                </React.Fragment>
                              ))}
                            </React.Fragment>
                          ))}
                          <tr className="table-secondary">
                            <td>{report.username} Total</td>
                            <td colSpan="3"></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td>
                              <b>{report.total.shift}</b>
                            </td>
                            <td>
                              <b>{report.total.hours?.toFixed(2)}</b>
                            </td>
                            <td>
                              <b>{report.total.cost?.toFixed(2)}</b>
                            </td>
                          </tr>
                        </React.Fragment>
                      ))}
                    </tbody>
                  </Table>
                )}
              </Card.Body>
              {error ? null : (
                <Row>
                  <Col md={2}>
                    <Form.Control
                      as="select"
                      value={perPage}
                      onChange={handleChangePerPage}
                      className="float-right"
                    >
                      <option value="100">100</option>
                      <option value="200">200</option>
                      <option value="500">500</option>
                    </Form.Control>
                  </Col>
                  <Col>
                    <ReactPaginate
                      pageCount={totalPages}
                      pageRangeDisplayed={5}
                      marginPagesDisplayed={2}
                      previousLabel={"<"}
                      nextLabel={">"}
                      breakLabel={"..."}
                      onPageChange={(selected) =>
                        handleChangePage(selected.selected + 1)
                      }
                      forcePage={page - 1}
                      containerClassName={"react-pagination"}
                      activeClassName={"active"}
                    />
                  </Col>
                </Row>
              )}
            </Card>
          </Col>
        </Row>
      </Container>
      <TimeSheetModal
        show={dialogOpen}
        handleClose={handleDialogClose}
        sheetEdit={sheetEdit}
        setSheetEdit={setSheetEdit}
        onSaveCallBack={fetchReportData}
      />
      <ToastContainer position="top-center" autoClose={3000} hideProgressBar />
    </>
  );
}

export default EmployeeReport;
