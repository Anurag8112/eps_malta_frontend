import axios from "axios";
import React, { useState } from "react";
import { Button, Modal, Form, Row, Col, Container } from "react-bootstrap";
import { toast, ToastContainer } from "react-toastify";

function QualificationsForm({
  handleClose,
  fetchQualificationData = () => {},
  qualificationDataEdit,
  setQualificationDataEdit,
  onSaveCallBack = () => {},
}) {
  const [qualifications, setQualificationName] = useState(
    qualificationDataEdit?.qualifications || ""
  );

  const qualificationId = qualificationDataEdit?.id;

  const handleSubmit = async (event) => {
    event.preventDefault();
    event.stopPropagation();

    const qualification = event.currentTarget;

    if (qualification.checkValidity()) {
      try {
        if (qualificationDataEdit.qualifications) {
          // Perform a PUT request if fromData
          await axios.put(`qualification/update/${qualificationId}`, {
            qualifications,
          });
          setQualificationDataEdit("");
          toast.success("Qualification updated successfully!");
        } else {
          // Perform a POST request if fromData doesn't have an Data
          await axios.post("qualification/add", {
            qualifications,
          });
          toast.success("Qualification added successfully!");
        }
        handleClose();
        fetchQualificationData();
        onSaveCallBack();
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
    qualification.classList.add("was-validated");
  };
  return (
    <>
      <Modal.Header>
        <Modal.Title id="example-modal-sizes-title-lg">
          {qualificationId ? "Edit Qualification " : "Add Qualification"}
        </Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          <Container>
            <Row>
              <Col md={12}>
                <Form.Group>
                  <Form.Label>Qualification</Form.Label>
                  <Form.Control
                    placeholder="Qualification"
                    type="text"
                    name="qualifications"
                    value={qualifications}
                    onChange={(e) => setQualificationName(e.target.value)}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
          </Container>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            CLOSE
          </Button>
          <Button variant="primary" type="submit">
            {qualificationId ? "UPDATE " : "SAVE"}
          </Button>
        </Modal.Footer>
      </Form>
      <ToastContainer position="top-center" autoClose={3000} hideProgressBar />
    </>
  );
}

export default QualificationsForm;
