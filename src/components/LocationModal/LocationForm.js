import { Modal, Button, Form, Row, Col } from "react-bootstrap";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { useState } from "react";
import Switch from "react-switch";

function LocationForm({
  handleClose,
  fetchLocations = () => {},
  locationEdit,
  setLocationEdit,
  onSaveCallBack = () => {},
}) {
  const [location, setLocations] = useState(locationEdit?.location || "");
  const [description, setDescription] = useState(
    locationEdit?.description || ""
  );
  const [isSwitchOn, setIsSwitchOn] = useState(
    locationEdit?.rate === "double" ? true : false
  );
  const locationId = locationEdit?.id;

  const handleSubmit = async (event) => {
    event.preventDefault();
    event.stopPropagation();

    const form = event.currentTarget;

    if (form.checkValidity()) {
      try {
        if (locationId) {
          // Perform a PUT request if locationEdit has an ID
          await axios.put(`location/update/${locationId}`, {
            location,
            description,
            rate: isSwitchOn ? "double" : "normal",
          });
          setLocationEdit("");
          toast.success("Location updated successfully!");
        } else {
          // Perform a POST request if locationEdit doesn't have an ID
          await axios.post("location/add", {
            location: location,
            description: description,
            rate: isSwitchOn ? "double" : "normal",
          });
          toast.success("Location created successfully!");
        }

        handleClose();
        fetchLocations();
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

    form.classList.add("was-validated"); // Add Bootstrap validation classes
  };

  return (
    <>
      <Modal.Header>
        <Modal.Title>
          {locationId ? "Edit Location" : "Add Location"}
        </Modal.Title>
      </Modal.Header>
      <Form noValidate onSubmit={handleSubmit} className="needs-validation">
        <Modal.Body>
          <Row>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Location</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Location"
                  value={location}
                  onChange={(e) => setLocations(e.target.value)}
                  name="location"
                  required
                />
                <Form.Control.Feedback type="invalid">
                  Please provide a Location.
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Description</Form.Label>
                <Form.Control
                  type="tex"
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
            {locationId ? "UPDATE" : "SAVE"}
          </Button>
        </Modal.Footer>
      </Form>
      <ToastContainer position="top-center" autoClose={3000} hideProgressBar />
    </>
  );
}

export default LocationForm;
