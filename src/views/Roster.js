import React, { useState, useEffect } from "react";
import {
  Card,
  Col,
  Container,
  Row,
  Spinner,
  Form,
  Table,
  Button,
} from "react-bootstrap";
import ReactPaginate from "react-paginate";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";
import { MultiSelect } from "react-multi-select-component";

function Roster() {
  const [rosterData, setRosterData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [group, setGroup] = useState("username");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(20);
  const [totalPages, setTotalPages] = useState(0);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [location, setLocation] = useState("");
  const [event, setEvent] = useState("");
  const [task, setTask] = useState("");
  const [clientId, setClientId] = useState("");
  const [employeeId, setEmployeeId] = useState("");
  const [selected, setSelected] = useState([]);
  const [employeeData, setEmployeeData] = useState({
    locations: [],
    events: [],
    tasks: [],
    client: [],
    employee: [],
  });

  const [currentFilter, setCurrentFilter] = useState(null);

  const fetchRosterData = async () => {
    try {
      setIsLoading(true);

      const params = {};
      if (group) params.group = group;
      if (selectedDate) params.date = selectedDate.toISOString().split("T")[0];
      if (location) params.locationId = location;
      if (event) params.eventId = event;
      if (task) params.taskId = task;
      if (employeeId) params.employeeId = employeeId;
      if (clientId) params.clientId = clientId;
      if (page) params.page = page;
      if (perPage) params.perPage = perPage;

      const response = await axios.get("roster/view", {
        params: params, // Pass the params as an object here
      });
      setRosterData(response.data.data);
      setTotalPages(response.data.totalPages);
      // console.log("response.data", response.data);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchEmployeeDetails = async () => {
    try {
      const params = {};
      if (selectedDate)
        params.date = selectedDate.toISOString().split("T")[0] || null;
      if (location) params.locationId = location;
      if (event) params.eventId = event;
      if (task) params.taskId = task;
      if (employeeId) params.employeeId = employeeId;
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
            ["locations", "events", "tasks", "client", "employee"].includes(
              currentFilter
            )
          ) {
            mergedData[currentFilter] = prevData[currentFilter];
          }
        }

        return mergedData;
      });
      // console.log("response.data", response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleClearFilters = () => {
    setTask("");
    setLocation("");
    setEvent("");
    setEmployeeId("");
    setSelected([]);
    setClientId("");
    setPage(1);
  };

  useEffect(() => {
    fetchEmployeeDetails();
  }, [selectedDate, location, event, task, employeeId, clientId]);

  useEffect(() => {
    fetchRosterData();
  }, [
    group,
    page,
    perPage,
    selectedDate,
    location,
    event,
    task,
    employeeId,
    clientId,
  ]);

  const handleEmployeeSelect = (selectedList) => {
    setSelected(selectedList);
    const formattedData = selectedList.map((item) => item.value);
    setEmployeeId(formattedData);
    setPage(1);
  };

  const handleChangePerPage = (event) => {
    setPerPage(Number(event.target.value));
    setPage(1); // Reset to the first page whenever items per page changes
  };

  const handleChangePage = (selectedPage) => {
    setPage(selectedPage);
  };

  const handleNextDate = () => {
    if (selectedDate) {
      setSelectedDate(new Date(selectedDate.getTime() + 24 * 60 * 60 * 1000));
    } else {
      setSelectedDate(new Date());
    }
  };

  const handlePreviousDate = () => {
    if (selectedDate) {
      setSelectedDate(new Date(selectedDate.getTime() - 24 * 60 * 60 * 1000));
    } else {
      setSelectedDate(new Date());
    }
  };

  const handleTodayDate = () => {
    setSelectedDate(new Date());
  };

  return (
    <>
      <Container fluid>
        <Row>
          <Col md={12}>
            <Row className="mb-2">
              <Col md="3">
                <MultiSelect
                  options={employeeData.employee
                    .sort((a, b) => a.employee?.localeCompare(b.employee))
                    .map((employee) => ({
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
                    name="location"
                    className="form-control-filter"
                    value={location}
                    onChange={(e) => {
                      setLocation(e.target.value);
                      setCurrentFilter("locations");
                    }}
                  >
                    <option value="">Locations</option>
                    {employeeData.locations.map((location) => (
                      <option key={location.id} value={location.id}>
                        {location.location}
                      </option>
                    ))}{" "}
                  </Form.Control>
                </Form.Group>
              </Col>
              <Col md="3">
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
              <Col md="3">
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
            </Row>
            <Row className="mb-2">
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
                  <Card.Title as="h4">Roster View</Card.Title>
                  <p className="card-category">Show All Roster View</p>
                </div>
                <Row>
                  <Col md={3}>
                    <Button onClick={handlePreviousDate} size="sm">
                      &lt;
                    </Button>{" "}
                    <Button onClick={handleNextDate} size="sm">
                      &gt;
                    </Button>{" "}
                    <Button onClick={handleTodayDate} size="sm">
                      Today
                    </Button>{" "}
                  </Col>
                  <Col md={3}>
                    <DatePicker
                      selected={selectedDate}
                      onChange={(date) => setSelectedDate(date)}
                      placeholderText="Select a date"
                      className="form-control-date form-control"
                      //   dateFormat="eee, dd MMM"
                    />
                  </Col>
                  <Col md={6}>
                    <Form.Group as={Row} controlId="formEvent">
                      <Form.Label column sm="4" className="text-right">
                        Group By:
                      </Form.Label>
                      <Col sm="6">
                        <Form.Control
                          as="select"
                          name="group"
                          className="form-control-filter"
                          value={group}
                          onChange={(e) => setGroup(e.target.value)}
                          required
                        >
                          <option value="username">Employee</option>
                          <option value="location">Location</option>
                          <option value="event">Event</option>
                          <option value="task">Task</option>
                          <option value="client">Client</option>
                        </Form.Control>
                      </Col>
                    </Form.Group>
                  </Col>
                </Row>
              </Card.Header>

              <Card.Body className="table-full-width table-responsive px-0">
                {isLoading ? (
                  <div style={{ textAlign: "center" }}>
                    <Spinner animation="border" role="status" />
                  </div>
                ) : (
                  <>
                    <Table striped hover responsive>
                      <thead>
                        <tr>
                          <th></th>
                          <th>Employee</th>
                          <th>Location</th>
                          <th>Event</th>
                          <th>Task</th>
                          <th>Client</th>
                          <th>Shift Time</th>
                        </tr>
                      </thead>
                      <tbody>
                        {rosterData.length > 0 ? (
                          rosterData.map((groupData) => (
                            <React.Fragment key={groupData[group]}>
                              <tr>
                                <td colSpan="7">
                                  <strong>{groupData[group] || "--"}</strong>
                                </td>
                              </tr>
                              {groupData.result.map((row) => (
                                <tr key={row.timesheet_id}>
                                  <td></td>
                                  <td>{row.username}</td>
                                  <td>{row.location}</td>
                                  <td>
                                    <span style={{ color: row.eventColor }}>
                                      {row.event}
                                    </span>
                                  </td>{" "}
                                  <td>{row.task}</td>
                                  <td>{row.client}</td>
                                  <td>{row.shiftTime}</td>
                                </tr>
                              ))}
                            </React.Fragment>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="7" className="text-center">
                              Data not found.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </Table>
                    <Row>
                      <Col md={2}>
                        <Form.Control
                          as="select"
                          value={perPage}
                          onChange={handleChangePerPage}
                          className="float-right"
                        >
                          <option value="10">10</option>
                          <option value="20">20</option>
                          <option value="50">50</option>
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
                  </>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default Roster;
