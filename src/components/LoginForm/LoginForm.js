import { useState } from "react";
import { Col, Button, Row, Container, Card, Form } from "react-bootstrap";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import backgroundImage from "../../assets/img/secu-1.webp";
import { Link } from "react-router-dom";

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [validated, setValidated] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;

    if (form.checkValidity() === false) {
      e.stopPropagation();
    }

    setValidated(true);

    try {
      if (form.checkValidity()) {
        const response = await axios.post("admin/login", {
          email,
          password,
        });

        if (response.status === 200) {
          localStorage.setItem("token", response.data.token);
          window.location.href = "/";
          toast.success("Login successfully!");
        }
      }
    } catch (error) {
      if (
        error.response &&
        (error.response.status === 401 ||
          error.response.status === 403 ||
          error.response.status === 404)
      ) {
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
          <Card className=" w-75">
            <Card.Body>
              <h4 className="fw-bold mb-3 text-uppercase">
                Employee Tracker - Login
              </h4>
              <p>Please enter login to your account to continue.</p>
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
                    Please enter your username.
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
                <Form.Group className="mb-3" controlId="formBasicCheckbox">
                  <p className="small">
                    <Link to="/forgot-password" style={{ color: "blue" }}>
                      Forgot password?
                    </Link>
                  </p>
                </Form.Group>
                <div className="d-grid">
                  <Button className="btn-fill btn-primary" type="submit">
                    LOG IN
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

export default LoginForm;
