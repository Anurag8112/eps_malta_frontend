import React, { useEffect, useState } from "react";
import { Card, Container, Row, Col, Button, Spinner } from "react-bootstrap";
import EventsModal from "../components/EventsModal/EventsModal.js";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";

function Events() {
  const [events, setEvents] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [eventEdit, setEventEdit] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const fetchEvents = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get("events/view");
      const data = response.data.map((row, index) => ({
        ...row,
        "S NO.": index + 1,
      }));
      setEvents(data);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleEventsDelete = async (eventId) => {
    try {
      const confirmDelete = window.confirm(
        "Are you sure you want to delete this event?"
      );
      if (confirmDelete) {
        await axios.delete(`events/delete/${eventId}`);
        const updatedEvents = events.filter((event) => event.id !== eventId);
        setEvents(updatedEvents);
        toast.success("Event deleted successfully!");
        fetchEvents();
      }
    } catch (error) {
      toast.error("Failed to delete event.");
      console.log(error);
    }
  };

  const onEventAdd = () => {
    setDialogOpen(true);
  };

  const onEventEdit = (eventEdit) => {
    setEventEdit(eventEdit);
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setEventEdit("");
  };

  const columns = [
    {
      dataField: "S NO.",
      text: "S NO.",
      sort: true,
      headerClasses: "border-0",
      classes: "border-0",
      headerStyle: { width: "100px" },
    },
    {
      dataField: "events",
      text: "Events",
      sort: true,
      headerClasses: "border-0",
      classes: "border-0",
      headerStyle: { width: "200px" },
      formatter: (cell, row) => (
        <span style={{ color: row.eventColor }}>{cell}</span>
      ),
    },
    {
      dataField: "description",
      text: "Description",
      sort: true,
      headerClasses: "border-0",
      classes: "border-0",
      headerStyle: { width: "400px" },
    },
    {
      dataField: "actions",
      text: "Actions",
      headerClasses: "border-0",
      classes: "border-0",
      formatter: (cell, row) => (
        <>
          <Button
            variant="info"
            size="sm"
            onClick={() => {
              onEventEdit(row);
            }}
          >
            EDIT
          </Button>{" "}
          <Button
            variant="danger"
            size="sm"
            onClick={() => handleEventsDelete(row.id)}
          >
            DELETE
          </Button>
        </>
      ),
    },
  ];

  return (
    <>
      <Container fluid>
        <Row>
          <Col md={12}>
            <Card className="stripped-table-with-hover">
              <Card.Header className="d-flex justify-content-between align-items-center">
                <div>
                  <Card.Title as="h4">Events</Card.Title>
                  <p className="card-category">Show All Events</p>
                </div>
                <Button variant="primary" onClick={onEventAdd}>
                  ADD
                </Button>
              </Card.Header>
              <Card.Body className="table-full-width table-responsive px-0">
                {isLoading ? (
                  <div style={{ textAlign: "center" }}>
                    <Spinner animation="border" role="status" />
                  </div>
                ) : (
                  <BootstrapTable
                    keyField="id"
                    data={events}
                    columns={columns}
                    pagination={paginationFactory()}
                    noDataIndication="data not found."
                    striped
                    hover
                  />
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
      <EventsModal
        show={dialogOpen}
        handleClose={handleDialogClose}
        fetchEvents={fetchEvents}
        eventEdit={eventEdit}
        setEventEdit={setEventEdit}
      />
      <ToastContainer position="top-center" autoClose={3000} hideProgressBar />
    </>
  );
}

export default Events;
