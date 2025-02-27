import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  Button,
  Modal,
  Form,
  Row,
  Col,
  Container,
  FormControl,
} from "react-bootstrap";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function LicenseReportForm({
  handleClose,
  licenseReportEdit,
  fetchLicenseData,
  setLicenseReportEdit,
}) {
  const [formValues, setFormValues] = useState(licenseReportEdit || {});
  const licenseSheetId = licenseReportEdit.tracker_id;
  const [formData, setFormData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResult, setSearchResult] = useState([]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const formData = new FormData();

      // Add your formValues data to the FormData object
      for (const key in formValues) {
        formData.append(key, formValues[key]);
      }

      if (licenseSheetId) {
        // Perform a PUT request if licenseSheetId is available
        await axios.put(`license/report/edit/${licenseSheetId}`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        toast.success("License updated successfully!");
        setLicenseReportEdit("");
      } else {
        // Perform a POST request if licenseSheetId is not available
        await axios.post("license/report/add", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        toast.success("License added successfully!");
      }
      handleClose();
      fetchLicenseData();
    } catch (error) {
      if (
        error.response &&
        (error.response.status === 404 ||
          error.response.status === 400 ||
          error.response.status === 500)
      ) {
        toast.error(error.response.data.error);
      }
    }
  };

  const fetchFormData = async () => {
    try {
      const response = await axios.get("forms/view");
      const data = response.data;
      setFormData(data);
      if (!licenseSheetId) {
        setFormValues({ ...formValues, category: data[0].type });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleSearch = async () => {
    try {
      const response = await axios.get(
        `timesheet/employee?username=${searchQuery}`
      );
      const data = response.data;
      setSearchResult(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      handleSearch();
    }, 500);
    return () => clearTimeout(debounceTimer);
  }, [searchQuery]);

  useEffect(() => {
    fetchFormData();
  }, []);

  const handleEntryDelete = async () => {
    try {
      const confirmDelete = window.confirm(
        "Are you sure you want to delete this license?"
      );
      if (confirmDelete) {
        await axios.delete(`license/report/delete/${licenseSheetId}`);
        toast.success("License deleted successfully!");
        handleClose();
        fetchLicenseData();
      }
    } catch (error) {
      toast.error("Failed to delete license.");
      console.log(error);
    }
  };

  return (
    <>
      <Modal.Header>
        <Modal.Title id="example-modal-sizes-title-lg">
          {licenseSheetId ? "Edit License Status" : "Add License Status"}
        </Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          <Container>
            <Row>
              <Col md={4}>
                <Form.Group>
                  <Form.Label>Form</Form.Label>
                  <Form.Control
                    as="select"
                    name="form"
                    placeholder="Form"
                    required
                    value={formValues.category || ""}
                    onChange={(e) =>
                      setFormValues({ ...formValues, category: e.target.value })
                    }
                  >
                    <option value="">Select</option>
                    {formData.map((form, index) => (
                      <option key={index} value={form.type}>
                        {form.formName}
                      </option>
                    ))}
                  </Form.Control>
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group>
                  <Form.Label>Employee Name</Form.Label>
                  <FormControl
                    type="search"
                    placeholder="Search Name..."
                    className="me-2"
                    aria-label="Search"
                    value={formValues.username || searchQuery}
                    onChange={(e) => {
                      const value = e.target.value;
                      const selectedEmployee = searchResult.find(
                        (employee) => employee.username === value
                      );
                      setFormValues((prevData) => ({
                        ...prevData,
                        username: value,
                        employeeId: selectedEmployee ? selectedEmployee.id : "",
                      }));
                      setSearchQuery(value);
                    }}
                    list="searchResultList"
                    required
                  />
                  {searchQuery && (
                    <>
                      <datalist id="searchResultList">
                        {searchResult.map((employee) => (
                          <option key={employee.id} value={employee.username} />
                        ))}
                      </datalist>
                    </>
                  )}
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group>
                  <Form.Label>Email Address</Form.Label>
                  <Form.Control
                    placeholder="Email"
                    type="email"
                    value={formValues.email || ""}
                    onChange={(e) =>
                      setFormValues({ ...formValues, email: e.target.value })
                    }
                    name="email"
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={4}>
                <Form.Group>
                  <Form.Label>Phone Number</Form.Label>
                  <Form.Control
                    placeholder="Phone"
                    type="phone"
                    value={formValues.phone_number || ""}
                    onChange={(e) =>
                      setFormValues({
                        ...formValues,
                        phone_number: e.target.value,
                      })
                    }
                    name="phone"
                    required
                  />
                </Form.Group>
              </Col>
              {formData.map((form) => {
                return form.type === formValues.category
                  ? form.fields.map((field, index) => (
                      <Col md={4} key={index}>
                        {field.field === "cbLicenseType" ? (
                          <Form.Group>
                            <Form.Label>{field.caption}</Form.Label>
                            {field.fieldType === "text" ? (
                              <Form.Control
                                type="text"
                                name="types"
                                placeholder={field.caption}
                                required
                                value={formValues.types || ""}
                                onChange={(e) =>
                                  setFormValues({
                                    ...formValues,
                                    types: e.target.value,
                                  })
                                }
                              />
                            ) : (
                              <Form.Control
                                as="select"
                                name="types"
                                required
                                value={formValues.types || ""}
                                onChange={(e) =>
                                  setFormValues({
                                    ...formValues,
                                    types: e.target.value,
                                  })
                                }
                              >
                                <option value="">Select</option>
                                {field.dd_values
                                  .split(",")
                                  .map((value, ddIndex) => (
                                    <option key={ddIndex} value={value}>
                                      {value}
                                    </option>
                                  ))}
                              </Form.Control>
                            )}
                          </Form.Group>
                        ) : (
                          <Form.Group>
                            <Form.Label>{field.caption}</Form.Label>
                            <Form.Control
                              type="text"
                              name="ref_number"
                              placeholder={field.caption}
                              required
                              value={formValues.ref_number || ""}
                              onChange={(e) =>
                                setFormValues({
                                  ...formValues,
                                  ref_number: e.target.value,
                                })
                              }
                            />
                          </Form.Group>
                        )}
                      </Col>
                    ))
                  : null;
              })}
            </Row>
            <Row>
              <Col md={4}>
                <Form.Group>
                  <Form.Label>Date applied</Form.Label>
                  <Form.Control
                    placeholder="Date"
                    type="date"
                    value={formValues.start_date || ""}
                    onChange={(e) =>
                      setFormValues({
                        ...formValues,
                        start_date: e.target.value,
                      })
                    }
                    name="dateApplied"
                    required
                  />
                </Form.Group>
              </Col>

              <Col md={4}>
                <Form.Group>
                  <Form.Label>Paid</Form.Label>
                  <Form.Control
                    as="select"
                    name="paid"
                    value={formValues.paid || ""}
                    onChange={(e) =>
                      setFormValues({ ...formValues, paid: e.target.value })
                    }
                    required
                  >
                    <option value="">Select</option>
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                  </Form.Control>
                </Form.Group>
              </Col>

              <Col md={4}>
                <Form.Group>
                  <Form.Label>No. of Month</Form.Label>
                  <Form.Control
                    placeholder="No. of Month"
                    type="number"
                    name="numberOfMonths"
                    value={formValues.no_of_month || ""}
                    onChange={(e) =>
                      setFormValues({
                        ...formValues,
                        no_of_month: e.target.value,
                      })
                    }
                    min={0}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={12}>
                <Form.Group>
                  <Form.Label>Select Receipt</Form.Label>
                  <Form.Control
                    placeholder="Select Receipt"
                    type="file"
                    name="receipt"
                    accept=".jpg, .jpeg, .png, .pdf, .doc, .docx"
                    required
                    onChange={(e) =>
                      setFormValues({
                        ...formValues,
                        receipt: e.target.files[0],
                      })
                    }
                  />
                  {formValues.receipt && (
                    <div>
                      {formValues.receipt instanceof File ? (
                        <a
                          href={URL.createObjectURL(formValues.receipt)}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          VIEW RECEIPT
                        </a>
                      ) : (
                        <a
                          href={`${process.env.REACT_APP_API_URL}${formValues.receipt}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          VIEW RECEIPT
                        </a>
                      )}
                    </div>
                  )}
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={12}>
                <Form.Group>
                  <Form.Label>Notes</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    placeholder="Notes"
                    type="text"
                    name="notes"
                    value={formValues.notes || ""}
                    onChange={(e) =>
                      setFormValues({
                        ...formValues,
                        notes: e.target.value,
                      })
                    }
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
          </Container>
        </Modal.Body>
        <Modal.Footer>
          <div className="mr-auto">
            {licenseSheetId && (
              <Button variant="danger" onClick={handleEntryDelete}>
                DELETE
              </Button>
            )}
          </div>
          <Button variant="secondary" onClick={handleClose}>
            CLOSE
          </Button>
          <Button variant="primary" type="submit">
            {licenseSheetId ? "UPDATE" : "SAVE"}
          </Button>
        </Modal.Footer>
      </Form>
      <ToastContainer position="top-center" autoClose={3000} hideProgressBar />
    </>
  );
}

export default LicenseReportForm;
