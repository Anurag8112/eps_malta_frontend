import { Modal, Button, Form, Row, Col } from "react-bootstrap";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { useState } from "react";

function EventsForm({
  handleClose,
  fetchEvents = () => {},
  eventEdit,
  setEventEdit,
  onSaveCallBack = () => {},
}) {
  const [events, setEvents] = useState(eventEdit?.events || "");
  const [description, setDescription] = useState(eventEdit?.description || "");
  const [eventColor, setEventColor] = useState(eventEdit?.eventColor || null);
  const eventId = eventEdit?.id;

  const handleSubmit = async (event) => {
    event.preventDefault();
    event.stopPropagation();

    const form = event.currentTarget;

    if (form.checkValidity()) {
      try {
        if (eventId) {
          // Perform a PUT request if eventEdit has an ID
          await axios.put(`events/update/${eventId}`, {
            events,
            description,
            eventColor,
          });
          setEventEdit("");
          toast.success("Events updated successfully!");
        } else {
          // Perform a POST request if eventEdit doesn't have an ID
          await axios.post("events/add", {
            events: events,
            description: description,
            eventColor: eventColor,
          });
          toast.success("Events created successfully!");
        }
        handleClose();
        fetchEvents();
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
        <Modal.Title>{eventId ? "Edit Events" : "Add Events"}</Modal.Title>
      </Modal.Header>
      <Form noValidate onSubmit={handleSubmit} className="needs-validation">
        <Modal.Body>
          <Row>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Events</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Events"
                  value={events}
                  onChange={(e) => setEvents(e.target.value)}
                  name="events"
                  required
                />
                <Form.Control.Feedback type="invalid">
                  Please provide an event name.
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
            <Col md={6}>
              <Form.Group>
                <Form.Label>Color</Form.Label>
                <Form.Control
                  type="color"
                  value={eventColor}
                  onChange={(e) => setEventColor(e.target.value)}
                  name="eventColor"
                  required
                />
                <Form.Control.Feedback type="invalid">
                  Please select a color.
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
            {eventId ? "UPDATE" : "SAVE"}
          </Button>
        </Modal.Footer>
      </Form>
      <ToastContainer position="top-center" autoClose={3000} hideProgressBar />
    </>
  );
}

export default EventsForm;
