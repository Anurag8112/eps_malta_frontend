import { Modal, Button, Form, Row, Col, Spinner } from "react-bootstrap";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useState } from "react";
import axios from "axios";

function EmailTemplateForm({
  handleClose,
  emailTemplateEdit,
  fetchEmailTemplate,
  setEmailTemplateEdit,
}) {
  const [type, setType] = useState(emailTemplateEdit?.type || "");
  const [subject, setSubject] = useState(emailTemplateEdit?.subject || "");
  const [body, setBody] = useState(emailTemplateEdit?.body || "");
  const emailTemplateId = emailTemplateEdit?.id;

  const handleSubmit = async (event) => {
    event.preventDefault();
    event.stopPropagation();

    const form = event.currentTarget;
    if (form.checkValidity()) {
      try {
        if (emailTemplateId) {
          // Perform a PUT request if eventEdit has an ID
          await axios.put(`license/email/template/update/${emailTemplateId}`, {
            type,
            subject,
            body,
          });
          setEmailTemplateEdit("");
          toast.success("Email Template updated successfully!");
        } else {
          //   Perform a POST request if eventEdit doesn't have an ID
          await axios.post("license/email/template/add", {
            type: type,
            subject: subject,
            body: body,
          });
          toast.success("Email Template created successfully!");
        }
        handleClose();
        fetchEmailTemplate();
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
    form.classList.add("was-validated");
  };

  return (
    <>
      <Modal.Header>
        <Modal.Title>
          {emailTemplateId ? "Edit Email Template" : "Add Email Template"}
        </Modal.Title>
      </Modal.Header>
      <Form noValidate onSubmit={handleSubmit} className="needs-validation">
        <Modal.Body>
          <Row>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Type</Form.Label>
                <Form.Control
                  as="select"
                  name="paid"
                  disabled={emailTemplateId}
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  required
                >
                  <option value="">Select</option>
                  <option value="90_DAYS">90_DAYS</option>
                  <option value="60_DAYS">60_DAYS</option>
                  <option value="30_DAYS">30_DAYS</option>
                </Form.Control>
                <Form.Control.Feedback type="invalid">
                  Please provide a type.
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={12}>
              <Form.Group>
                <Form.Label>Subject</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Subject"
                  name="subject"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  required
                />
                <Form.Control.Feedback type="invalid">
                  Please provide a subject.
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col md={12}>
              <Form.Group>
                <Form.Label>Body</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={5}
                  placeholder="Body"
                  type="text"
                  name="body"
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  required
                />
                <Form.Control.Feedback type="invalid">
                  Please provide a body.
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
            {emailTemplateId ? "UPDATE" : "SAVE"}
          </Button>
        </Modal.Footer>
      </Form>
      <ToastContainer position="top-center" autoClose={3000} hideProgressBar />
    </>
  );
}

export default EmailTemplateForm;
