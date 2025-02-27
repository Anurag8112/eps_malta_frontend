import axios from "axios";
import React, { useState } from "react";
import { Button, Modal, Form, Row, Col, Container } from "react-bootstrap";
import { TrashFill, Plus } from "react-bootstrap-icons";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function FormAdd({
  handleClose,
  fetchFormData,
  formDataEdit,
  setFormDataEdit,
}) {
  const [formName, setFormName] = useState(formDataEdit.formName || "");
  const [fields, setFields] = useState(
    formDataEdit.fields || [
      {
        field: "",
        caption: "",
        dd_values: "",
        fieldType: "",
        id: "",
      },
    ]
  );

  const handleChange = (index, e) => {
    const { name, value } = e.target;
    const updatedFields = [...fields];
    updatedFields[index][name] = value;
    setFields(updatedFields);
  };

  const inputNewField = () => {
    setFields([
      ...fields,
      {
        field: "",
        caption: "",
        dd_values: "",
        fieldType: "",
        id: "",
      },
    ]);
  };

  const removeField = async (index, fieldId) => {
    if (fieldId) {
      try {
        const confirmDelete = window.confirm(
          "Are you sure you want to delete this employee?"
        );
        if (confirmDelete) {
          await axios.delete(`forms/delete/${fieldId}`);
          toast.success("Form Data deleted successfully!");
          handleClose();
          fetchFormData();
        }
      } catch (error) {
        toast.error("Failed to delete form data.");
        console.log(error);
      }
    } else {
      const updatedFields = [...fields];
      updatedFields.splice(index, 1);
      setFields(updatedFields);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      if (formDataEdit.formName) {
        // Perform a PUT request if fromData
        await axios.put("forms/edit", {
          formName,
          fields,
        });
        toast.success("Form Data updated successfully!");
        setFormDataEdit("");
      } else {
        // Perform a POST request if fromData doesn't have an Data
        await axios.post("forms/add", {
          formName,
          fields,
        });
        toast.success("Form Data added successfully!");
      }
      handleClose();
      fetchFormData();
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
  return (
    <>
      <Modal.Header>
        <Modal.Title id="example-modal-sizes-title-lg">
          {formDataEdit.formName ? "Edit Form " : "Add Form"}
        </Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          <Container>
            <Row>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Form Name</Form.Label>
                  <Form.Control
                    placeholder="Form Name"
                    type="text"
                    name="formName"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    required
                  />
                </Form.Group>
              </Col>
              {formDataEdit.formName ? null : (
                <Button
                  variant="primary"
                  style={{ height: "fit-content", marginTop: "auto" }}
                  onClick={inputNewField}
                >
                  <Plus size={24} />
                  ADD
                </Button>
              )}
            </Row>
            {fields.map((field, index) => (
              <Row key={index}>
                <Col md={3}>
                  <Form.Group>
                    <Form.Label>Field</Form.Label>
                    <Form.Control
                      as="select"
                      name="field"
                      value={field.field}
                      onChange={(e) => handleChange(index, e)}
                      required
                    >
                      <option value="">Select</option>
                      <option value="cbLicenseType">License Type</option>
                      <option value="tbLicenseNo">License No.</option>
                    </Form.Control>
                  </Form.Group>
                </Col>
                <Col md={3}>
                  <Form.Group>
                    <Form.Label>Caption</Form.Label>
                    <Form.Control
                      placeholder="Caption"
                      type="text"
                      name="caption"
                      value={field.caption}
                      onChange={(e) => handleChange(index, e)}
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={2}>
                  <Form.Group>
                    <Form.Label>Values</Form.Label>
                    <Form.Control
                      placeholder="Values"
                      type="text"
                      name="dd_values"
                      value={field.dd_values}
                      onChange={(e) => handleChange(index, e)}
                    />
                  </Form.Group>
                </Col>
                <Col md={2}>
                  <Form.Group>
                    <Form.Label>Field Type</Form.Label>
                    <Form.Control
                      as="select"
                      name="fieldType"
                      placeholder="Field Type"
                      value={field.fieldType}
                      onChange={(e) => handleChange(index, e)}
                      required
                    >
                      <option value="text">Input</option>
                      <option value="dd_value">Drop Down</option>
                    </Form.Control>
                  </Form.Group>
                </Col>
                {index !== 0 && (
                  <Button
                    variant="danger"
                    style={{
                      height: "fit-content",
                      marginTop: "auto",
                      marginLeft: "10px",
                    }}
                    onClick={() => removeField(index, field.id)}
                  >
                    <TrashFill />
                  </Button>
                )}
              </Row>
            ))}
          </Container>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            CLOSE
          </Button>
          <Button variant="primary" type="submit">
            {formDataEdit.formName ? "UPDATE " : "SAVE"}
          </Button>
        </Modal.Footer>
      </Form>
      <ToastContainer position="top-center" autoClose={3000} hideProgressBar />
    </>
  );
}

export default FormAdd;
