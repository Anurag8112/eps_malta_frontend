import React, { useState, useRef } from "react";
import {
  Col,
  Button,
  Row,
  Container,
  Card,
  Form,
  Spinner,
} from "react-bootstrap";
import backgroundImage from "../../assets/img/secu-1.webp";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router";

function ForgotPassword() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(Array(6).fill(""));
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const otpInputs = useRef([]);
  const navigate = useNavigate();

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    const enteredEmail = e.target.email.value;

    try {
      const response = await axios.post("admin/forgot-password", {
        email: enteredEmail,
      });
      setEmail(enteredEmail);
      if (response.status === 200) {
        setStep(2);
        toast.success("OTP Send successfully!");
      }
    } catch (error) {
      if (
        error.response &&
        (error.response.status === 404 || error.response.status === 500)
      ) {
        toast.error(error.response.data.error);
      } else {
        toast.error("Email Not send.");
      }
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    const enteredOtp = otp.join("");
    setIsLoading(true);
    setTimeout(async () => {
      try {
        const response = await axios.post("admin/verify-otp", {
          email: email,
          otp: enteredOtp,
        });

        if (response.status === 200) {
          setStep(3);
          toast.success("OTP verification successfully!");
        }
      } catch (error) {
        if (error.response && error.response.status === 400) {
          toast.error(error.response.data.error);
        }
      } finally {
        setIsLoading(false);
      }
    }, 5000);
  };

  const handleNewPasswordSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("password and confirm password do not match.");
      return;
    }
    try {
      const response = await axios.post("admin/update-password", {
        email,
        otp: otp.join(""),
        password: password,
      });

      setEmail("");
      setOtp([]);
      setPassword("");
      setConfirmPassword("");
      if (response.status === 200) {
        toast.success("Password Reset successfully!");
        setTimeout(() => {
          navigate("/login");
        }, 3000);
      }
    } catch (error) {
      if (
        (error.response && error.response.status === 400) ||
        error.response.status === 500
      ) {
        toast.error(error.response.data.error);
      }
    }
  };

  const handleOtpChange = (index, newValue) => {
    if (/^[0-9]$/.test(newValue) || newValue === "") {
      const newOtp = [...otp];
      newOtp[index] = newValue;
      setOtp(newOtp);

      if (newValue !== "9" && index < 5 && newValue !== "") {
        otpInputs.current[index + 1].focus();
      } else if (newValue === "" && index > 0) {
        otpInputs.current[index - 1].focus();
      }
    }
  };

  return (
    <>
      <Container fluid>
        <Row className="vh-100">
          <Col sm={6} className="p-0">
            <div
              className="sidebar-background-image"
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
                <h3 className="fw-bold mb-3 text-uppercase">Forgot Password</h3>
                {step === 1 && (
                  <Form onSubmit={handleEmailSubmit}>
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                      <Form.Label>Email</Form.Label>
                      <Form.Control
                        required
                        type="email"
                        placeholder="Enter your email"
                        name="email"
                      />
                    </Form.Group>
                    <div className="d-grid">
                      <Button className="btn-fill btn-primary" type="submit">
                        SEND OTP
                      </Button>
                    </div>
                  </Form>
                )}
                {step === 2 && (
                  <Form onSubmit={handleOtpSubmit}>
                    <Form.Group className="mb-3" controlId="formBasicOtp">
                      <Form.Label>OTP</Form.Label>
                      <div className="d-flex">
                        {[1, 2, 3, 4, 5, 6].map((index) => (
                          <Form.Control
                            key={index}
                            type="text"
                            inputMode="numeric"
                            className="mx-1"
                            name={`otp${index}`}
                            maxLength="1"
                            style={{ maxWidth: "5rem" }}
                            value={otp[index - 1] || ""}
                            onChange={(e) =>
                              handleOtpChange(index - 1, e.target.value)
                            }
                            required
                            min="0"
                            ref={(input) =>
                              (otpInputs.current[index - 1] = input)
                            }
                          />
                        ))}
                      </div>
                    </Form.Group>
                    <div className="d-grid">
                      <Button
                        className="btn-fill btn-primary"
                        type="submit"
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <>
                            <Spinner
                              as="span"
                              animation="border"
                              size="sm"
                              role="status"
                              aria-hidden="true"
                            />
                            <span className="visually-hidden">Verify..</span>
                          </>
                        ) : (
                          "VERIFY OTP"
                        )}
                      </Button>
                    </div>
                  </Form>
                )}
                {step === 3 && (
                  <Form onSubmit={handleNewPasswordSubmit}>
                    <Form.Group
                      className="mb-3"
                      controlId="formBasicNewPassword"
                    >
                      <Form.Label>New Password</Form.Label>
                      <Form.Control
                        type="password"
                        placeholder="Enter your new password"
                        name="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                    </Form.Group>
                    <Form.Group
                      className="mb-3"
                      controlId="formBasicConfirmPassword"
                    >
                      <Form.Label>Confirm Password</Form.Label>
                      <Form.Control
                        type="password"
                        placeholder="Confirm your password"
                        name="confirmPassword"
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                      />
                    </Form.Group>
                    <div className="d-grid">
                      <Button className="btn-fill btn-primary" type="submit">
                        RESET PASSWORD
                      </Button>
                    </div>
                  </Form>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
      <ToastContainer position="top-center" autoClose={3000} hideProgressBar />
    </>
  );
}

export default ForgotPassword;
