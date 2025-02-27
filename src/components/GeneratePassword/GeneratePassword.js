import { useState } from "react";
import { Col, Button, Row, Container, Card, Form } from "react-bootstrap";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import backgroundImage from "../../assets/img/secu-1.webp";

function GeneratePassword() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();
  const [validated, setValidated] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;

    if (form.checkValidity() === false) {
      e.stopPropagation();
    }

    setValidated(true);
    // Check if the new password and confirm password match
    if (password !== confirmPassword) {
      toast.error("password and confirm password do not match.");
      return;
    }

    try {
      if (form.checkValidity()) {
        const response = await axios.post("admin/generate-password", {
          email,
          password,
        });

        if (response.status === 200) {
          toast.success(response.data.message);
          navigate("/login");
          setEmail("");
          setPassword("");
          setConfirmPassword("");
        }
      }
    } catch (error) {
      if (error.response && error.response.data && error.response.data.error) {
        toast.error(error.response.data.error);
      } else {
        toast.error("An error occurred. Please try again later.");
      }
    }
  };

  return (
    <Container fluid>
      <Row className="vh-100">
        <Col sm={6} className="p-0">
          <div
            className="sidebar-background"
            style={{
              backgroundImage: `url(${backgroundImage})`,
              backgroundSize: "cover",
              backgroundPosition: "left",
              height: "100%",
            }}
          ></div>
        </Col>
        <Col
          sm={6}
          className="d-flex justify-content-center align-items-center"
        >
          <Card className="w-75">
            <Card.Body>
              <h4 className="fw-bold mb-3 text-uppercase">
                Generate Password Here !
              </h4>
              <Form noValidate validated={validated} onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="formBasicUserName">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    required
                    type="text"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <Form.Control.Feedback type="invalid">
                    Please enter your email.
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicPassword">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    required
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <Form.Control.Feedback type="invalid">
                    Please enter your password.
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicPassword">
                  <Form.Label>Confirm Password</Form.Label>
                  <Form.Control
                    required
                    type="password"
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                  <Form.Control.Feedback type="invalid">
                    Please Confirm your password.
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicCheckbox">
                  <p className="small">
                    <a href="/login" style={{ color: "blue" }}>
                      login ?
                    </a>
                  </p>
                </Form.Group>
                <div className="d-grid">
                  <Button className="btn-fill btn-primary" type="submit">
                    SUBMIT
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <ToastContainer position="top-center" autoClose={3000} hideProgressBar />
    </Container>
  );
}

export default GeneratePassword;
