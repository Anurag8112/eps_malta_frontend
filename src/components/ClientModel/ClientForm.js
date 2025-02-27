import axios from "axios";
import { useState } from "react";
import { Modal, Button, Form, Row, Col } from "react-bootstrap";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Switch from "react-switch";

function ClientName({
  handleClose,
  clientEdit,
  setClientEdit,
  fetchClient = () => {},
  onSaveCallBack = () => {},
}) {
  const [clientName, setClientName] = useState(clientEdit?.clientName || "");
  const [email, setEmail] = useState(clientEdit?.email || "");
  const [isSwitchOn, setIsSwitchOn] = useState(
    clientEdit?.rate === "double" ? true : false
  );
  const clientId = clientEdit?.id;

  const handleSubmit = async (event) => {
    event.preventDefault();
    event.stopPropagation();

    const form = event.currentTarget;

    if (form.checkValidity()) {
      try {
        if (clientId) {
          // Perform a PUT request if eventEdit has an ID
          await axios.put(`client/update/${clientId}`, {
            clientName,
            email,
            rate: isSwitchOn ? "double" : "normal",
          });
          setClientEdit("");
          toast.success("client updated successfully!");
        } else {
          // Perform a POST request if eventEdit doesn't have an ID
          await axios.post("client/add", {
            clientName: clientName,
            email: email,
            rate: isSwitchOn ? "double" : "normal",
          });
          toast.success("client created successfully!");
        }

        handleClose();
        fetchClient();
        onSaveCallBack();
      } catch (error) {
        if (
          error.response &&
          (error.response.status === 404 ||
            error.response.status === 409 ||
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
        <Modal.Title>{clientId ? "Edit Client" : "Add Client"}</Modal.Title>
      </Modal.Header>
      <Form noValidate onSubmit={handleSubmit} className="needs-validation">
        <Modal.Body>
          <Row>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Client Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Client Name"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  name="clientName"
                  required
                />
                <Form.Control.Feedback type="invalid">
                  Please provide a Client Name.
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  name="email"
                  required
                />
                <Form.Control.Feedback type="invalid">
                  Please provide a Email.
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group controlId="formRate">
                <Form.Label column sm="4">
                  Rate
                </Form.Label>
                <Col sm="8">
                  <label className="d-flex align-items-center mt-2">
                    <span className="mr-3" style={{ fontSize: "14px" }}>
                      Normal
                    </span>
                    <Switch
                      id="rate"
                      checked={isSwitchOn}
                      onChange={(checked) => setIsSwitchOn(checked)}
                      checkedIcon={false}
                      uncheckedIcon={false}
                      onColor="#86d3ff"
                      height={22}
                      width={46}
                      boxShadow="0px 1px 5px rgba(0, 0, 0, 0.6)"
                    />
                    <span className="ml-3" style={{ fontSize: "14px" }}>
                      Double
                    </span>
                  </label>
                </Col>
              </Form.Group>
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            CLOSE
          </Button>
          <Button variant="primary" type="submit">
            {clientId ? "UPDATE" : "SAVE"}
          </Button>
        </Modal.Footer>
      </Form>
      <ToastContainer position="top-center" autoClose={3000} hideProgressBar />
    </>
  );
}

export default ClientName;
