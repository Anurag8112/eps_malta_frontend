import axios from "axios";
import React, { useEffect, useState } from "react";
import { Button, Card, Form, Container, Row, Col } from "react-bootstrap";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function AppSetting() {
  const [companyLogo, setCompanyLogo] = useState(null);
  const [colors, setColors] = useState("");
  const [rateCap, setRateCap] = useState("");
  const [appTitle, setAppTitle] = useState("");
  const [pdfHeaderLogo, setPdfHeaderLogo] = useState(null);
  const [pdfFooterInfo, setPdfFooterInfo] = useState("");
  const [accessToken, setAccessToken] = useState("");

  const fetchSetting = async () => {
    try {
      const response = await axios.get("setting/view");
      const {
        company_logo,
        colors,
        rate_cap,
        app_title,
        pdf_header_logo,
        pdf_footer_info,
        access_token,
      } = response.data.result[0];
      setCompanyLogo(company_logo);
      setColors(colors);
      setRateCap(rate_cap);
      setAppTitle(app_title);
      setPdfHeaderLogo(pdf_header_logo);
      setPdfFooterInfo(pdf_footer_info);
      setAccessToken(access_token);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchSetting();
  }, []);

  const handleFileChange = (e, setterFunction) => {
    const file = e.target.files[0];
    setterFunction(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("company_logo", companyLogo);
    formData.append("colors", colors);
    formData.append("rate_cap", rateCap);
    formData.append("app_title", appTitle);
    formData.append("pdf_header_logo", pdfHeaderLogo);
    formData.append("pdf_footer_info", pdfFooterInfo);
    formData.append("access_token", accessToken);

    try {
      await axios.put(`setting/update/1`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      toast.success("App setting update successfully!");
    } catch (error) {
      if (error.response && error.response.status === 500) {
        toast.error(error.response.data.error);
      }
    }
  };

  return (
    <>
      <Container fluid>
        <Row>
          <Col md="10">
            <Card>
              <Card.Header>
                <Card.Title as="h4">App Setting</Card.Title>
              </Card.Header>
              <Card.Body>
                <Form onSubmit={handleSubmit}>
                  <Row>
                    <Col className="pr-1" md="6">
                      <Form.Group>
                        <label>Company Logo</label>
                        <Form.Control
                          type="file"
                          onChange={(e) => handleFileChange(e, setCompanyLogo)}
                          accept="image/*"
                        />
                      </Form.Group>
                    </Col>
                    <Col className="pr-1" md="6">
                      {companyLogo && (
                        <div>
                          {companyLogo instanceof File ? (
                            <img
                              src={URL.createObjectURL(companyLogo)}
                              alt="Company Logo"
                              style={{ maxWidth: "100px" }}
                            />
                          ) : (
                            <img
                              src={`${process.env.REACT_APP_API_URL}${companyLogo}`}
                              alt="Company Logo"
                              style={{ maxWidth: "100px" }}
                            />
                          )}
                        </div>
                      )}
                    </Col>
                  </Row>
                  <Row>
                    <Col className="pr-1" md="6">
                      <Form.Group>
                        <label>Colors</label>
                        <Form.Control
                          value={colors}
                          onChange={(e) => setColors(e.target.value)}
                          name="colors"
                          type="color"
                          required
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                  <Row>
                    <Col className="pr-1" md="6">
                      <Form.Group>
                        <label>Rate Cap</label>
                        <Form.Control
                          name="rate_cap"
                          value={rateCap}
                          placeholder="Rate Cap"
                          onChange={(e) => setRateCap(e.target.value)}
                          type="number"
                          required
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                  <Row>
                    <Col className="pr-1" md="6">
                      <Form.Group>
                        <label>App Title</label>
                        <Form.Control
                          name="app_title"
                          value={appTitle}
                          placeholder="App Title"
                          onChange={(e) => setAppTitle(e.target.value)}
                          type="text"
                          required
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                  <Row>
                    <Col className="pr-1" md="6">
                      <Form.Group>
                        <label>PDF Header Logo</label>
                        <Form.Control
                          type="file"
                          onChange={(e) =>
                            handleFileChange(e, setPdfHeaderLogo)
                          }
                          name="pdfHeaderLogo"
                          accept="image/*"
                        />
                      </Form.Group>
                    </Col>
                    <Col className="pr-1" md="6">
                      {pdfHeaderLogo && (
                        <div>
                          {pdfHeaderLogo instanceof File ? (
                            <img
                              src={URL.createObjectURL(pdfHeaderLogo)}
                              alt="pdf Header Logo"
                              style={{ maxWidth: "100px" }}
                            />
                          ) : (
                            <img
                              src={`${process.env.REACT_APP_API_URL}${pdfHeaderLogo}`}
                              alt="pdf Header Logo"
                              style={{ maxWidth: "100px" }}
                            />
                          )}
                        </div>
                      )}
                    </Col>
                  </Row>
                  <Row>
                    <Col className="pr-1" md="6">
                      <Form.Group>
                        <label>PDF Footer Info</label>
                        <Form.Control
                          as="textarea"
                          value={pdfFooterInfo}
                          placeholder="PDF Footer Info"
                          onChange={(e) => setPdfFooterInfo(e.target.value)}
                          name="pdfFooterInfo"
                          rows={4}
                          type="text"
                          required
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  <Row>
                    <Col className="pr-1" md="8">
                      <Form.Group>
                        <label>WhatsApp Access Token</label>
                        <Form.Control
                          as="textarea"
                          value={accessToken}
                          placeholder="WhatsApp Acess Token"
                          onChange={(e) => setAccessToken(e.target.value)}
                          name="pdfFooterInfo"
                          rows={4}
                          type="text"
                          required
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  <Row>
                    <Col className="pr-1" md="6">
                      <Button type="submit" variant="info">
                        UPDATE
                      </Button>
                    </Col>
                  </Row>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
      <ToastContainer position="top-center" autoClose={3000} hideProgressBar />
    </>
  );
}

export default AppSetting;
