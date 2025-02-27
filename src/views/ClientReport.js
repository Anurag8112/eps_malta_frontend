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
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useTokenInfo } from "../authRoutes/PrivateRoutes.js";
import { MultiSelect } from "react-multi-select-component";

function ClientReport() {
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
  const [employeeId, setEmployeeId] = useState("");
  const [clientId, setClientId] = useState("");
  const [rate, setRate] = useState("");
  const [ratePerHour, setRatePerHour] = useState("");
  const [titleId, setTitleId] = useState("");
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isSendingMail, setIsSendingMail] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState();
  const [perPage, setPerPage] = useState(100);
  const [selected, setSelected] = useState([]);
  const [selectedRatePerHours, setSelectedRatePerHours] = useState([]);
  const [employeeData, setEmployeeData] = useState({
    locations: [],
    events: [],
    tasks: [],
    client: [],
    title: [],
    year: [],
    month: [],
    employee: [],
    ratePerHour: [],
  });
  const [currentFilter, setCurrentFilter] = useState(null);

  const fetchReportData = async () => {
    try {
      setIsLoading(true);
      const params = new URLSearchParams({
        year: years,
        month: months,
        locationId: location,
        eventId: event,
        taskId: task,
        employeeId: userRole === "2" ? userId : employeeId,
        rate,
        ratePerHour,
        clientId,
        page,
        perPage,
      });

      const response = await axios.get("timesheet/client/report", {
        params: params, // Pass the params as an object here
      });

      const { reports, grandTotal, pagination } = response.data;
      setReportData(reports);
      setGrandTotal(grandTotal);
      setTotalPages(pagination.totalPages);
      setError(null);
      // console.log("response.data", response.data);
    } catch (error) {
      console.error("Error retrieving employee data:", error);
      setError("Data Not Found !");
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
      if (employeeId) params.employeeId = employeeId;
      if (rate) params.rate = rate;
      if (ratePerHour) params.ratePerHour = ratePerHour;
      if (clientId) params.clientId = clientId;

      const response = await axios.get("timesheet/filter/employee/details", {
        params: params,
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

  const handleEmployeeSelect = (selectedList) => {
    setSelected(selectedList);
    const formattedData = selectedList.map((item) => item.value);
    setEmployeeId(formattedData);
    fetchEmployeeDetails("employeeId", formattedData);
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
    setEmployeeId("");
    setSelected([]);
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
        ratePerHour,
        clientId,
        titleId,
        page,
        perPage,
        action,
      });
      if (action === "download-client") {
        console.log("action", action);
        setIsDownloading(true);
        const response = await axios.get("timesheet/client/report-pdf", {
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
      } else if (action === "send-client") {
        setIsSendingMail(true);
        await axios.get("timesheet/client/report-pdf", {
          params: params,
        });
        toast.success("Email sent successfully!");
      }
    } catch (error) {
      console.error("Error retrieving employee data as PDF:", error);
      if (action === "download-client") {
        toast.error("Failed to download report.");
      } else {
        toast.error("Email not send.");
      }
    } finally {
      setIsDownloading(false);
      setIsSendingMail(false);
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
                          setCurrentFilter("clientId", e.target.value);
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
              <Card.Header className="d-flex justify-content-between align-items-center">
                <div>
                  <Card.Title as="h4">Client Reports</Card.Title>
                  <p className="card-category">Show All Reports</p>
                </div>
                <Col md="3" style={{ marginLeft: "30%" }}>
                  <Form.Group>
                    <Form.Control
                      as="select"
                      name="title"
                      className="form-control-filter"
                      value={titleId}
                      onChange={(e) => setTitleId(e.target.value)}
                      required
                    >
                      <option value="">Select Template</option>
                      {employeeData.title.map(
                        (title) =>
                          title.type === "client" && (
                            <option key={title.id} value={title.id}>
                              {title.title}
                            </option>
                          )
                      )}
                    </Form.Control>
                  </Form.Group>
                </Col>
                <div>
                  <Button
                    onClick={() => handleDownloadAndSend("download-client")}
                    disabled={!titleId || isDownloading}
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
                        />
                        <span className="visually-hidden">Downloading..</span>
                      </>
                    ) : (
                      "DOWNLOAD"
                    )}
                  </Button>{" "}
                  <Button
                    onClick={() => handleDownloadAndSend("send-client")}
                    disabled={!titleId || isSendingMail}
                    size="sm"
                  >
                    {isSendingMail ? (
                      <>
                        <Spinner
                          as="span"
                          animation="border"
                          size="sm"
                          role="status"
                          aria-hidden="true"
                        />
                        <span className="visually-hidden">Sending..</span>
                      </>
                    ) : (
                      "SEND MAIL"
                    )}
                  </Button>
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
                        <td colSpan="13">
                          <b>Grand Total</b>
                        </td>
                        <td>
                          <b>{grandTotal.shift}</b>
                        </td>
                        <td>
                          <b>{grandTotal.hours.toFixed(2)}</b>
                        </td>
                        <td>
                          <b>{grandTotal.cost.toFixed(2)}</b>
                        </td>
                      </tr>
                      <tr className="table-secondary">
                        <th>Client</th>
                        <th>Location</th>
                        <th>Name</th>
                        <th>Year</th>
                        <th>Month</th>
                        <th>R.P.H</th>
                        <th>Date</th>
                        <th>Rate</th>
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
                        <React.Fragment key={report.client}>
                          {report.records.map((locationWise, locationIndex) => (
                            <React.Fragment key={locationWise.locationId}>
                              {locationWise.records.map(
                                (userWise, userIndex) => (
                                  <React.Fragment key={userWise.username}>
                                    {userWise.records.map(
                                      (yearWise, yearIndex) => (
                                        <React.Fragment key={yearWise.year}>
                                          {yearWise.records.map(
                                            (monthWise, monthIndex) => (
                                              <React.Fragment
                                                key={monthWise.month}
                                              >
                                                {monthWise.records.map(
                                                  (
                                                    ratePerHourWise,
                                                    ratePerHourIndex
                                                  ) => (
                                                    <React.Fragment
                                                      key={
                                                        ratePerHourWise.ratePerHour
                                                      }
                                                    >
                                                      {ratePerHourWise.records.map(
                                                        (item, index) => (
                                                          <tr
                                                            key={
                                                              item.timesheet_id
                                                            }
                                                          >
                                                            <td>
                                                              {index === 0 &&
                                                                locationIndex ===
                                                                  0 &&
                                                                userIndex ===
                                                                  0 &&
                                                                yearIndex ===
                                                                  0 &&
                                                                monthIndex ===
                                                                  0 &&
                                                                ratePerHourIndex ===
                                                                  0 &&
                                                                (report.client !==
                                                                null
                                                                  ? report.client
                                                                  : "N/A")}
                                                            </td>
                                                            <td>
                                                              {index === 0 &&
                                                              userIndex === 0 &&
                                                              yearIndex === 0 &&
                                                              monthIndex ===
                                                                0 &&
                                                              ratePerHourIndex ===
                                                                0
                                                                ? locationWise.location
                                                                : ""}
                                                            </td>
                                                            <td>
                                                              {index === 0 &&
                                                              yearIndex === 0 &&
                                                              monthIndex ===
                                                                0 &&
                                                              ratePerHourIndex ===
                                                                0
                                                                ? userWise.username
                                                                : ""}
                                                            </td>
                                                            <td>
                                                              {monthIndex ===
                                                                0 &&
                                                              index === 0 &&
                                                              ratePerHourIndex ===
                                                                0
                                                                ? yearWise.year
                                                                : ""}
                                                            </td>
                                                            <td>
                                                              {index === 0 &&
                                                              ratePerHourIndex ===
                                                                0
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
                                                              {moment(
                                                                item.date
                                                              ).format(
                                                                "DD/MM/YYYY"
                                                              )}
                                                            </td>
                                                            <td>
                                                              {item.rate ===
                                                              "normal"
                                                                ? "Normal"
                                                                : "Double"}
                                                            </td>
                                                            <td>
                                                              {item.event}
                                                            </td>
                                                            <td>{item.task}</td>
                                                            <td>
                                                              <b>
                                                                {
                                                                  item.timesheet_id
                                                                }
                                                              </b>
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
                                                            <td>
                                                              {item.hours}
                                                            </td>
                                                            <td>{item.cost}</td>
                                                          </tr>
                                                        )
                                                      )}
                                                      <tr>
                                                        <td></td>
                                                        <td></td>
                                                        <td></td>
                                                        <td></td>
                                                        <td></td>
                                                        <td>
                                                          {
                                                            ratePerHourWise.ratePerHour
                                                          }{" "}
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
                                                              ratePerHourWise
                                                                .total.shift
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
                                              </React.Fragment>
                                            )
                                          )}
                                        </React.Fragment>
                                      )
                                    )}
                                  </React.Fragment>
                                )
                              )}
                              <tr>
                                <td></td>
                                <td>{locationWise.location} Total</td>
                                <td></td>
                                <td></td>
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
                                  <b>{locationWise.total.shift}</b>
                                </td>
                                <td>
                                  <b>{locationWise.total.hours?.toFixed(2)}</b>
                                </td>
                                <td>
                                  <b>{locationWise.total.cost?.toFixed(2)}</b>
                                </td>
                              </tr>
                            </React.Fragment>
                          ))}
                          <tr className="table-secondary">
                            <td>
                              {report.client !== null ? report.client : "N/A"}{" "}
                              Total
                            </td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td>{report.total.shift}</td>
                            <td>{report.total.hours?.toFixed(2)}</td>
                            <td>{report.total.cost?.toFixed(2)}</td>
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
      <ToastContainer position="top-center" autoClose={3000} hideProgressBar />
    </>
  );
}

export default ClientReport;
