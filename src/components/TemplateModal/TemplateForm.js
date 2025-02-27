import axios from "axios";
import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Row, Col, Container } from "react-bootstrap";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const options = {
  client: [
    { id: 1, label: "Client", value: "clientId", checked: false },
    { id: 2, label: "Location", value: "locationId", checked: false },
    { id: 3, label: "Employee", value: "employeeId", checked: false },
    { id: 4, label: "Year", value: "year", checked: false },
    { id: 5, label: "Month", value: "month", checked: false },
    { id: 6, label: "Rate Per Hour", value: "ratePerHour", checked: false },
    { id: 7, label: "Date", value: "date", checked: false },
    { id: 8, label: "Event", value: "eventId", checked: false },
    { id: 9, label: "Task", value: "taskId", checked: false },
    { id: 10, label: "Start Time", value: "startTime", checked: false },
    { id: 11, label: "End Time", value: "endTime", checked: false },
    { id: 12, label: "Week", value: "week", checked: false },
    { id: 13, label: "Rate", value: "rate", checked: false },
    { id: 14, label: "Shift Count", value: "shift", checked: false },
    { id: 15, label: "Hours", value: "hours", checked: false },
    { id: 16, label: "Cost", value: "cost", checked: false },
  ],
  employee: [
    { id: 1, label: "Employee", value: "employeeId", checked: false },
    { id: 2, label: "Rate", value: "rate", checked: false },
    { id: 3, label: "Year", value: "year", checked: false },
    { id: 4, label: "Month", value: "month", checked: false },
    { id: 5, label: "Rate Per Hour", value: "ratePerHour", checked: false },
    { id: 6, label: "Date", value: "date", checked: false },
    { id: 7, label: "Location", value: "locationId", checked: false },
    { id: 8, label: "Event", value: "eventId", checked: false },
    { id: 9, label: "Task", value: "taskId", checked: false },
    { id: 10, label: "Start Time", value: "startTime", checked: false },
    { id: 11, label: "End Time", value: "endTime", checked: false },
    { id: 12, label: "Client", value: "clientId", checked: false },
    { id: 13, label: "Week", value: "week", checked: false },
    { id: 14, label: "Shift Count", value: "shift", checked: false },
    { id: 15, label: "Hours", value: "hours", checked: false },
    { id: 16, label: "Cost", value: "cost", checked: false },
  ],
  timesheet: [
    { id: 1, label: "Employee", value: "employeeId", checked: false },
    { id: 2, label: "Date", value: "date", checked: false },
    { id: 3, label: "Client", value: "clientId", checked: false },
    { id: 4, label: "Location", value: "locationId", checked: false },
    { id: 5, label: "Event", value: "eventId", checked: false },
    { id: 6, label: "Task", value: "taskId", checked: false },
    { id: 7, label: "Start Time", value: "startTime", checked: false },
    { id: 8, label: "End Time", value: "endTime", checked: false },
    { id: 9, label: "Rate Per Hour", value: "ratePerHour", checked: false },
    { id: 10, label: "Hours", value: "hours", checked: false },
    { id: 11, label: "Cost", value: "cost", checked: false },
    { id: 12, label: "Year", value: "year", checked: false },
    { id: 13, label: "Month", value: "month", checked: false },
    { id: 14, label: "Week", value: "week", checked: false },
    { id: 15, label: "Rate", value: "rate", checked: false },
    { id: 16, label: "Invoiced", value: "invoiced", checked: false },
    { id: 17, label: "Created By", value: "createdBy", checked: false },
    { id: 18, label: "Created At", value: "createdAt", checked: false },
    {
      id: 19,
      label: "Last Modified By",
      value: "lastModifiedBy",
      checked: false,
    },
    {
      id: 20,
      label: "Last Modified At",
      value: "lastModifiedAt",
      checked: false,
    },
  ],
};

function TemplateForm({
  handleClose,
  templateEdit,
  setTemplateEdit,
  fetchTemplate,
}) {
  const [title, setTitle] = useState(templateEdit.title || "");
  const [type, setType] = useState(templateEdit.type || "employee");
  const templateId = templateEdit.id;
  const disabledValues = {
    client: [
      "clientId",
      "locationId",
      "employeeId",
      "year",
      "month",
      "ratePerHour",
      "date",
      "shift",
      "hours",
      "cost",
    ],
    employee: [
      "employeeId",
      "rate",
      "year",
      "month",
      "ratePerHour",
      "date",
      "shift",
      "hours",
      "cost",
    ],
    timesheet: ["employeeId"],
  };
  const [checkboxOptions, setCheckboxOptions] = useState([]);

  useEffect(() => {
    const updatedOptions = options[type].map((option) => ({
      ...option,
      checked:
        disabledValues[type].includes(option.value) ||
        (templateEdit.timesheetName
          ? templateEdit.timesheetName.split(",").includes(option.value)
          : false),
    }));

    setCheckboxOptions(updatedOptions);
  }, [type, templateEdit]);

  const handleCheckboxChange = (id) => {
    setCheckboxOptions((prevOptions) =>
      prevOptions.map((option) =>
        option.id === id && !disabledValues[type].includes(option.value)
          ? { ...option, checked: !option.checked }
          : option
      )
    );
  };

  const resetFormState = () => {
    setTitle("");
    setCheckboxOptions((prevOptions) =>
      prevOptions.map((option) => ({ ...option, checked: false }))
    );
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const selectedData = checkboxOptions
      .filter((option) => option.checked)
      .map((option) => ({ values: option.value }));

    const result = {
      title: title,
      timesheetName: selectedData.map((item) => item.values).join(","),
      type: type,
    };

    try {
      if (templateId) {
        await axios.put(`template/edit/${templateId}`, {
          title: result.title,
          timesheetName: result.timesheetName,
          type: result.type,
        });
        setTemplateEdit("");
        toast.success("Template updated successfully!");
      } else {
        await axios.post("template/add", {
          title: result.title,
          timesheetName: result.timesheetName,
          type: result.type,
        });
        toast.success("Template created successfully!");
      }

      handleClose();
      fetchTemplate();
      resetFormState();
    } catch (error) {
      if (templateId) {
        toast.error("Failed to update template.");
      } else {
        toast.error("Failed to create template.");
      }
      console.error(error);
    }
  };

  return (
    <>
      <Modal.Header>
        <Modal.Title>
          {templateId ? "Edit Template" : "Add Template"}
        </Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          <Container>
            <Row>
              <Col md={6}>
                <Form.Group controlId="formTemplateTitle">
                  <Form.Label>Title</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter template title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="formTemplateType">
                  <Form.Label>Type</Form.Label>
                  <Form.Control
                    as="select"
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    required
                  >
                    <option value="client">Client</option>
                    <option value="employee">Employee</option>
                    <option value="timesheet">Timesheet</option>
                  </Form.Control>
                </Form.Group>
              </Col>
            </Row>
            <Row>
              {checkboxOptions.map((option) => (
                <Col md={6} key={option.id}>
                  <Form.Check
                    type="checkbox"
                    id={option.id}
                    label={option.label}
                    checked={option.checked}
                    disabled={disabledValues[type].includes(option.value)}
                    onChange={() => handleCheckboxChange(option.id)}
                  />
                </Col>
              ))}
            </Row>
          </Container>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button type="submit" variant="primary">
            {templateId ? "Update Template" : "Create Template"}
          </Button>
        </Modal.Footer>
      </Form>
      <ToastContainer />
    </>
  );
}

export default TemplateForm;
