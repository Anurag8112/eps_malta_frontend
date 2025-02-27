import axios from "axios";
import { useState } from "react";
import { Modal, Button, Form, Row, Col } from "react-bootstrap";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function LicenseTypeForm({
  handleClose,
  linceseEdit,
  setLinceseEdit,
  fetchLicense,
}) {
  const [licenseType, setLinceseType] = useState(linceseEdit.licenseType || "");
  const [description, setDescription] = useState(linceseEdit.description || "");
  const linceseTypeId = linceseEdit.id;

  const handleSubmit = async (event) => {
    event.preventDefault();
    event.stopPropagation();

    const form = event.currentTarget;

    if (form.checkValidity()) {
      try {
        if (linceseTypeId) {
          // Perform a PUT request if locationEdit has an ID
          await axios.put(`license/edit/${linceseTypeId}`, {
            licenseType,
            description,
          });
          setLinceseEdit("");
          toast.success("License updated successfully!");
        } else {
          // Perform a POST request if locationEdit doesn't have an ID
          await axios.post("license/add", {
            licenseType: licenseType,
            description: description,
          });
          toast.success("License created successfully!");
        }

        handleClose();
        fetchLicense();
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
    }

    form.classList.add("was-validated"); // Add Bootstrap validation classes
  };

  return (
    <>
      <Modal.Header>
        <Modal.Title>
          {linceseTypeId ? "Edit License" : "Add License"}
        </Modal.Title>
      </Modal.Header>
      <Form noValidate onSubmit={handleSubmit} className="needs-validation">
        <Modal.Body>
          <Row>
            <Col md={6}>
              <Form.Group>
                <Form.Label>License Type</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="License Type"
                  value={licenseType}
                  onChange={(e) => setLinceseType(e.target.value)}
                  name="licenseType"
                  required
                />
                <Form.Control.Feedback type="invalid">
                  Please provide a License Type.
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Description</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  name="description"
                  required
                />
                <Form.Control.Feedback type="invalid">
                  Please provide a description.
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            CLOSE
          </Button>
          <Button variant="primary" type="submit">
            {linceseTypeId ? "UPDATE" : "SAVE"}
          </Button>
        </Modal.Footer>
      </Form>
      <ToastContainer position="top-center" autoClose={3000} hideProgressBar />
    </>
  );
}

export default LicenseTypeForm;
