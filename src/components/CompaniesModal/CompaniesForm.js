import { Modal, Button, Form, Row, Col } from "react-bootstrap";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { useState } from "react";
import Switch from "react-switch";

function CompaniesForm({
  handleClose,
  fetchCompanies,
  companiesEdit,
  setCompaniesEdit,
}) {
  const [companiesData, setCompaniesData] = useState(companiesEdit || "");
  const [isSwitchOn, setIsSwitchOn] = useState(companiesEdit?.status === "1");

  const companiesId = companiesEdit?.id;

  const handleSubmit = async (event) => {
    event.preventDefault();
    event.stopPropagation();

    const form = event.currentTarget;
    const status = isSwitchOn ? "1" : "0";
    const newCompaniesData = {
      ...companiesData,
      status: status,
    };
    if (form.checkValidity()) {
      try {
        if (companiesId) {
          await axios.put(`companies/edit/${companiesId}`, newCompaniesData);
          setCompaniesEdit("");
          toast.success("Companies updated successfully!");
        } else {
          await axios.post("companies/add", newCompaniesData);
          toast.success("Companies Added successfully!");
        }

        handleClose();
        fetchCompanies();
      } catch (error) {
        if (
          error.response &&
          (error.response.status === 404 || error.response.status === 500)
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
          {companiesId ? "Update Companies" : "Add Companies"}
        </Modal.Title>
      </Modal.Header>
      <Form noValidate onSubmit={handleSubmit} className="needs-validation">
        <Modal.Body>
          <Row>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Name"
                  name="name"
                  required
                  value={companiesData.name}
                  onChange={(e) =>
                    setCompaniesData((prevData) => ({
                      ...prevData,
                      name: e.target.value,
                    }))
                  }
                />
                <Form.Control.Feedback type="invalid">
                  Please provide a Name.
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Email"
                  name="email"
                  required
                  value={companiesData.email || ""}
                  onChange={(e) =>
                    setCompaniesData((prevData) => ({
                      ...prevData,
                      email: e.target.value,
                    }))
                  }
                />
                <Form.Control.Feedback type="invalid">
                  Please provide a email.
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Mobile</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="Mobile"
                  name="mobile"
                  required
                  value={companiesData.mobile}
                  onChange={(e) =>
                    setCompaniesData((prevData) => ({
                      ...prevData,
                      mobile: e.target.value,
                    }))
                  }
                />
                <Form.Control.Feedback type="invalid">
                  Please provide a mobile.
                </Form.Control.Feedback>
              </Form.Group>
            </Col>{" "}
            <Col md={6}>
              <Form.Group>
                <Form.Label>Company URL</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Company URL"
                  name="domain"
                  required
                  value={companiesData.domain}
                  onChange={(e) =>
                    setCompaniesData((prevData) => ({
                      ...prevData,
                      domain: e.target.value,
                    }))
                  }
                />
                <Form.Control.Feedback type="invalid">
                  Please provide a host name.
                </Form.Control.Feedback>
              </Form.Group>
            </Col>{" "}
            <Col md={6}>
              <Form.Group>
                <Form.Label>Address</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  type="text"
                  placeholder="Address"
                  name="address"
                  required
                  value={companiesData.address}
                  onChange={(e) =>
                    setCompaniesData((prevData) => ({
                      ...prevData,
                      address: e.target.value,
                    }))
                  }
                />
                <Form.Control.Feedback type="invalid">
                  Please provide a address.
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Status</Form.Label>
                <div style={{ marginTop: "8px" }}>
                  <label className="d-flex align-items-center">
                    <span className="mr-3" style={{ fontSize: "14px" }}>
                      Inactive
                    </span>
                    <Switch
                      id="rate"
                      checked={isSwitchOn}
                      checkedIcon={false}
                      uncheckedIcon={false}
                      onColor="#86d3ff"
                      height={22}
                      width={46}
                      boxShadow="0px 1px 5px rgba(0, 0, 0, 0.6)"
                      onChange={(checked) => {
                        setIsSwitchOn(checked);
                      }}
                    />
                    <span className="ml-3" style={{ fontSize: "14px" }}>
                      Active
                    </span>
                  </label>
                </div>
              </Form.Group>
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            CLOSE
          </Button>
          <Button variant="primary" type="submit">
            {companiesId ? "UPDATE" : "SAVE"}
          </Button>
        </Modal.Footer>
      </Form>
      <ToastContainer position="top-center" autoClose={3000} hideProgressBar />
    </>
  );
}

export default CompaniesForm;
