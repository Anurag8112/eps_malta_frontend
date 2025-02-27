import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Button,
  Modal,
  Form,
  Row,
  Col,
  FormControl,
  Container,
} from "react-bootstrap";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link } from "react-router-dom";
import TasksModal from "../TasksModal/TasksModal.js";
import LocationModal from "../LocationModal/LocaltionModal.js";
import EventsModal from "../EventsModal/EventsModal.js";
import ClientModal from "../ClientModel/ClientModel.js";
import moment from "moment";
import { Spinner } from "react-bootstrap";
import TimePicker from "react-time-picker-input";
import "react-time-picker-input/dist/components/TimeInput.css";
import DatePicker from "react-multi-date-picker";

function TimeSheetForm({
  handleClose,
  sheetEdit,
  setSheetEdit,
  onSaveCallBack,
  dateClickInfo,
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [durationHours, durationMinutes] = (sheetEdit?.hours || "").split(".");
  const [sheetData, setSheetData] = useState(
    {
      ...sheetEdit,
      durationHours,
      durationMinutes,
      date: dateClickInfo
        ? [
            {
              date: moment(dateClickInfo.date).format("YYYY-MM-DD"),
              isPublicHoliday: false,
            },
          ]
        : sheetEdit
        ? sheetEdit.date
        : [],
    } || ""
  );

  const [employeeIds, setEmployeeIds] = useState([]);
  const [formData, setFormData] = useState({
    locations: [],
    events: [],
    tasks: [],
    client: [],
    ratecap: [],
  });
  const [locationDialogOpen, setLocationDialogOpen] = useState(false);
  const [eventDialogOpen, setEventDialogOpen] = useState(false);
  const [taskDialogOpen, setTaskDialogOpen] = useState(false);
  const [clientDialogOpen, setClientDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState(
    dateClickInfo ? moment(dateClickInfo?.dateStr).toDate() : null
  );

  const timesheetId = sheetEdit?.timesheet_id;

  // console.log("sheetData.date", sheetData.date);

  const handleLocationDialogOpen = () => {
    setLocationDialogOpen(true);
  };
  const handleEventDialogOpen = () => {
    setEventDialogOpen(true);
  };
  const handleTaskDialogOpen = () => {
    setTaskDialogOpen(true);
  };
  const handleClientDialogOpen = () => {
    setClientDialogOpen(true);
  };

  const handleDialogClose = () => {
    setLocationDialogOpen(false);
    setEventDialogOpen(false);
    setTaskDialogOpen(false);
    setClientDialogOpen(false);
  };

  useEffect(() => {
    fetchEmployeeDetails();
  }, []);

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      handleSearch();
    }, 500);
    return () => clearTimeout(debounceTimer);
  }, [searchQuery]);

  const handleCheckboxChange = (employeeId) => {
    setEmployeeIds((prevIds) => {
      if (prevIds.includes(employeeId)) {
        return prevIds.filter((id) => id !== employeeId);
      } else {
        return [...prevIds, employeeId];
      }
    });
  };

  const handleSearch = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        `timesheet/employee?username=${searchQuery}`
      );
      setSearchResult(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchEmployeeDetails = async () => {
    try {
      const response = await axios.get("timesheet/employee/details");
      const { locations, events, tasks, client, rate_cap } = response.data;
      setFormData({
        locations,
        events,
        tasks,
        client,
        ratecap: rate_cap[0].rateCap,
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmitForm = async (event, saveAndAddMore = true) => {
    event.preventDefault();

    const hours = `${sheetData.durationHours}.${
      sheetData?.durationMinutes || "00"
    }`;

    const submitData = {
      ...sheetData,
      employeeIds,
      hours,
    };

    const requiredFields = [
      timesheetId ? "employeeId" : "employeeIds",
      "date",
      "locationId",
      "clientId",
      "durationHours",
      "startTime",
      "ratePerHour",
      "taskId",
      "eventId",
    ];

    const missingFields = requiredFields.filter((field) => {
      // Check if the field is employeeIds and it's an array
      if (field === "employeeIds" && Array.isArray(submitData[field])) {
        return submitData[field].length === 0; // Check if the array is empty
      }
      return !submitData[field]; // For other fields, check if they are missing
    });

    if (!submitData.date || submitData.date.length === 0) {
      toast.error("Please enter a valid date.");
      return;
    }

    if (missingFields.length > 0) {
      toast.error(`Please fill all the required fields.`);
      return;
    }

    try {
      if (timesheetId) {
        // Perform a PUT request if timesheetId exists
        await axios.put(
          `timesheet/employee/entryupdate/${timesheetId}`,
          submitData
        );
        toast.success("Entry update successful!");
        setSheetEdit("");
      } else {
        // Perform a POST request if timesheetId does not exist
        await axios.post("timesheet/employee/entryadd", submitData);
        toast.success("Entry submission successful!");
      }

      // Reset form fields if saveAndAddMore is false
      if (!saveAndAddMore) {
        resetFormFields();
      }

      // Close the form if saveAndAddMore is true
      if (saveAndAddMore) {
        handleClose();
      }

      await onSaveCallBack();
    } catch (error) {
      const errorMsg =
        error.response?.data?.message || "An unexpected error occurred.";
      toast.error(errorMsg);
      console.error(error);
    }
  };

  const handleEntryDelete = async () => {
    try {
      const confirmDelete = window.confirm(
        "Are you sure you want to delete this entry?"
      );
      if (confirmDelete) {
        await axios.delete(`timesheet/employee/entrydelete/${timesheetId}`);
        toast.success("Entry deleted successfully!");
        handleClose();
        await onSaveCallBack();
      }
    } catch (error) {
      toast.error("Failed to delete entry.");
      console.log(error);
    }
  };

  // Function to reset specific form fields
  const resetFormFields = () => {
    setSheetData((prevData) => ({
      ...prevData,
      date: "",
      startTime: "",
      durationHours: "",
    }));
    setStartDate("");
    setEndDate("");
  };

  // Function to handle the "Save & Add More" button click
  const handleSaveAndAddMore = async (event) => {
    event.preventDefault();
    try {
      await handleSubmitForm(event, false);
    } catch (error) {
      toast.error("An error occurred while saving. Please try again.");
      console.error(error);
    }
  };

  const getAllDatesInRange = (start, end) => {
    const datesArray = [];
    let currentDate = new Date(start);
    const endDate = new Date(end);

    while (currentDate <= endDate) {
      datesArray.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return datesArray;
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);

    const accumulatedDatesSet = new Set();

    // Check if date is an array of ranges
    if (Array.isArray(date)) {
      date.forEach((range) => {
        if (Array.isArray(range)) {
          // Range is an array, so it has start and end dates
          const startDate = range[0] ? range[0].format("YYYY-MM-DD") : null;
          const endDate = range[1] ? range[1].format("YYYY-MM-DD") : null;
          if (startDate && endDate) {
            const dateRange = getAllDatesInRange(startDate, endDate);
            dateRange.forEach((date) => {
              accumulatedDatesSet.add(moment(date).format("YYYY-MM-DD"));
            });
          }
        }
      });

      // Convert Set to Array of objects
      const accumulatedDates = Array.from(accumulatedDatesSet).map((date) => ({
        date,
        isPublicHoliday: false,
      }));

      setSheetData((prevSheetData) => ({
        ...prevSheetData,
        date: accumulatedDates,
      }));
    }
  };

  const handleDateCheckboxChange = (index) => {
    setSheetData((prevSheetData) => {
      const updatedDates = [...prevSheetData.date];
      updatedDates[index] = {
        ...updatedDates[index],
        isPublicHoliday: !updatedDates[index].isPublicHoliday,
      };
      return {
        ...prevSheetData,
        date: updatedDates,
      };
    });
  };

  return (
    <>
      <Modal.Header>
        <Modal.Title>{timesheetId ? "Edit Shift" : "Add Shift"}</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmitForm}>
        <Modal.Body>
          <Container>
            <Row>
              <Col sm={6}>
                <Form.Group as={Row} controlId="formUsername">
                  <Form.Label column sm="4">
                    Name
                  </Form.Label>
                  <Col sm="12">
                    <FormControl
                      type="search"
                      placeholder="Search Name..."
                      className="mb-2"
                      aria-label="Search"
                      value={sheetData.username || searchQuery}
                      onChange={(e) => {
                        const value = e.target.value;
                        const selectedEmployee = searchResult.find(
                          (employee) => employee.username === value
                        );

                        if (timesheetId) {
                          setSheetData((prevData) => ({
                            ...prevData,
                            username: value,
                            employeeId: selectedEmployee
                              ? selectedEmployee.id
                              : "",
                          }));
                        }
                        setSearchQuery(value);
                      }}
                      list={timesheetId ? "searchResultList" : undefined}
                    />
                    {timesheetId ? (
                      <datalist id="searchResultList">
                        {searchResult.map((employee) => (
                          <option key={employee.id} value={employee.username} />
                        ))}
                      </datalist>
                    ) : (
                      <div id="searchResultList" className="searchListNew">
                        {isLoading ? (
                          <div style={{ textAlign: "center" }}>
                            <Spinner animation="border" role="status">
                              <span className="sr-only">Loading...</span>
                            </Spinner>
                          </div>
                        ) : (
                          <Form>
                            {searchResult.length === 0 ? (
                              <p>No employee found.</p>
                            ) : (
                              searchResult.map((employee) => (
                                <Form.Group
                                  controlId={employee.id}
                                  key={employee.id}
                                >
                                  <Form.Check
                                    type="checkbox"
                                    label={employee.username}
                                    checked={employeeIds.includes(employee.id)}
                                    onChange={() =>
                                      handleCheckboxChange(employee.id)
                                    }
                                    required
                                  />
                                </Form.Group>
                              ))
                            )}
                          </Form>
                        )}
                      </div>
                    )}
                  </Col>
                </Form.Group>
              </Col>
              <Col sm={6}>
                <Form.Group as={Row} controlId="formDate">
                  <Form.Label column sm="4">
                    Date
                  </Form.Label>
                  <Col sm="8">
                    {timesheetId ? (
                      <DatePicker
                        value={sheetData.date ? new Date(sheetData.date) : null}
                        format="DD/MM/YYYY"
                        onChange={(date) =>
                          setSheetData((prevData) => ({
                            ...prevData,
                            date: date ? date.format("YYYY-MM-DD") : null,
                          }))
                        }
                        placeholder="Select a date"
                        required
                      />
                    ) : (
                      <>
                        <DatePicker
                          value={selectedDate}
                          onChange={handleDateChange}
                          format="DD/MM/YYYY"
                          multiple
                          range
                          placeholder="Select a date"
                          required
                        />
                        {selectedDate && sheetData.date.length > 0 && (
                          <>
                            <Form.Label style={{ fontSize: "small" }}>
                              Mark Holidays
                            </Form.Label>
                            <div
                              style={{
                                maxHeight: "100px",
                                marginBottom: "10px",
                              }}
                              className="searchListNew"
                            >
                              {Array.isArray(sheetData.date) &&
                                sheetData.date.map((date, index) => (
                                  <Form.Group controlId={date.date} key={index}>
                                    <Form.Check
                                      type="checkbox"
                                      label={moment(date.date).format(
                                        "DD/MM/YYYY"
                                      )}
                                      checked={date.isPublicHoliday}
                                      onChange={() =>
                                        handleDateCheckboxChange(index)
                                      }
                                    />
                                  </Form.Group>
                                ))}
                            </div>
                          </>
                        )}
                      </>
                    )}
                  </Col>
                </Form.Group>
                <Form.Group as={Row} controlId="formLocation">
                  <Form.Label column sm="4">
                    Location
                  </Form.Label>
                  <Col sm="8">
                    <Form.Control
                      as="select"
                      value={sheetData.locationId}
                      onChange={(e) =>
                        setSheetData((prevData) => ({
                          ...prevData,
                          locationId: e.target.value,
                        }))
                      }
                      required
                    >
                      <option value="">Select</option>
                      {formData.locations.map((location) => (
                        <option key={location.id} value={location.id}>
                          {location.location}
                        </option>
                      ))}
                    </Form.Control>
                    <Link
                      className="link-tag"
                      onClick={handleLocationDialogOpen}
                    >
                      + Add Location
                    </Link>
                  </Col>
                </Form.Group>
                <Form.Group as={Row} controlId="formEvent">
                  <Form.Label column sm="4">
                    Event
                  </Form.Label>
                  <Col sm="8">
                    <Form.Control
                      as="select"
                      value={sheetData.eventId}
                      onChange={(e) =>
                        setSheetData((prevData) => ({
                          ...prevData,
                          eventId: e.target.value,
                        }))
                      }
                      required
                    >
                      <option value="">Select</option>
                      {formData.events.map((event) => (
                        <option key={event.id} value={event.id}>
                          {event.events}
                        </option>
                      ))}
                    </Form.Control>
                    <Link className="link-tag" onClick={handleEventDialogOpen}>
                      + Add Event
                    </Link>
                  </Col>
                </Form.Group>
                <Form.Group as={Row} controlId="formTask">
                  <Form.Label column sm="4">
                    Task
                  </Form.Label>
                  <Col sm="8">
                    <Form.Control
                      as="select"
                      value={sheetData.taskId}
                      onChange={(e) =>
                        setSheetData((prevData) => ({
                          ...prevData,
                          taskId: e.target.value,
                        }))
                      }
                      required
                    >
                      <option value="">Select</option>
                      {formData.tasks.map((task) => (
                        <option key={task.id} value={task.id}>
                          {task.tasks}
                        </option>
                      ))}
                    </Form.Control>
                    <Link className="link-tag" onClick={handleTaskDialogOpen}>
                      + Add Task
                    </Link>
                  </Col>
                </Form.Group>
                <Form.Group as={Row} controlId="formClient">
                  <Form.Label column sm="4">
                    Client
                  </Form.Label>
                  <Col sm="8">
                    <Form.Control
                      as="select"
                      value={sheetData.clientId}
                      onChange={(e) =>
                        setSheetData((prevData) => ({
                          ...prevData,
                          clientId: e.target.value,
                        }))
                      }
                      required
                    >
                      <option value="">Select</option>
                      {formData.client.map((client) => (
                        <option key={client.id} value={client.id}>
                          {client.client}
                        </option>
                      ))}
                    </Form.Control>
                    <Link className="link-tag" onClick={handleClientDialogOpen}>
                      + Add Client
                    </Link>
                  </Col>
                </Form.Group>
                <Form.Group as={Row} controlId="formStartTime">
                  <Form.Label column sm="4">
                    Start Time
                  </Form.Label>
                  <Col sm="8">
                    <TimePicker
                      className="mb-2"
                      value={sheetData.startTime || ""}
                      onChange={(value) =>
                        setSheetData((prevData) => ({
                          ...prevData,
                          startTime: value,
                        }))
                      }
                      name="startTime"
                      eachInputDropdown
                      manuallyDisplayDropdown
                      allowDelete
                      hour12Format
                      required
                    />
                  </Col>
                </Form.Group>
                <Form.Group as={Row} controlId="formShiftDuration">
                  <Form.Label column sm="4">
                    Shift Duration
                  </Form.Label>
                  <Col sm="4">
                    <Form.Control
                      className="mb-2"
                      placeholder="Hours"
                      type="number"
                      name="durationHours"
                      min={0}
                      max={23}
                      value={sheetData.durationHours}
                      onChange={(e) => {
                        const inputValue = Math.min(
                          parseFloat(e.target.value),
                          23
                        );
                        setSheetData((prevData) => ({
                          ...prevData,
                          durationHours: inputValue,
                        }));
                      }}
                      required
                    />
                  </Col>
                  <Col sm="4">
                    <Form.Control
                      className="mb-1"
                      placeholder="Minutes"
                      type="number"
                      name="durationMinutes"
                      max={59}
                      min={0}
                      value={sheetData.durationMinutes || "00"}
                      onChange={(e) => {
                        const inputValue = Math.min(
                          parseFloat(e.target.value),
                          59
                        );
                        setSheetData((prevData) => ({
                          ...prevData,
                          durationMinutes: inputValue
                            .toFixed()
                            .padStart(2, "0"),
                        }));
                      }}
                      required
                    />
                  </Col>
                </Form.Group>
                <Form.Group as={Row} controlId="formHourlyRate">
                  <Form.Label column sm="4">
                    Hourly Rate
                  </Form.Label>
                  <Col sm="8">
                    <Form.Control
                      className="mb-2"
                      placeholder="Hourly Rate"
                      type="number"
                      value={sheetData.ratePerHour}
                      onChange={(e) => {
                        const inputValue = Math.min(
                          parseFloat(e.target.value),
                          formData.ratecap
                        );
                        setSheetData((prevData) => ({
                          ...prevData,
                          ratePerHour: inputValue,
                        }));
                      }}
                      name="ratePerHour"
                      step="0.01"
                      min={0}
                      max={formData.ratecap}
                      required
                    />
                  </Col>
                </Form.Group>
              </Col>
            </Row>
          </Container>
        </Modal.Body>
        <Modal.Footer>
          <div className="mr-auto">
            {timesheetId ? (
              <Button variant="danger" onClick={handleEntryDelete}>
                DELETE
              </Button>
            ) : null}
          </div>
          <Button variant="secondary" onClick={handleClose}>
            CLOSE
          </Button>
          <Button variant="primary" type="submit">
            {timesheetId ? "UPDATE" : "SAVE"}
          </Button>
          {!timesheetId ? (
            <Button variant="primary" onClick={handleSaveAndAddMore}>
              SAVE & ADD MORE
            </Button>
          ) : null}
        </Modal.Footer>
      </Form>
      <ToastContainer position="top-center" autoClose={3000} hideProgressBar />
      <LocationModal
        show={locationDialogOpen}
        handleClose={handleDialogClose}
        onSaveCallBack={fetchEmployeeDetails}
      />
      <EventsModal
        show={eventDialogOpen}
        handleClose={handleDialogClose}
        onSaveCallBack={fetchEmployeeDetails}
      />
      <TasksModal
        show={taskDialogOpen}
        handleClose={handleDialogClose}
        onSaveCallBack={fetchEmployeeDetails}
      />
      <ClientModal
        show={clientDialogOpen}
        handleClose={handleDialogClose}
        onSaveCallBack={fetchEmployeeDetails}
      />
    </>
  );
}

export default TimeSheetForm;
