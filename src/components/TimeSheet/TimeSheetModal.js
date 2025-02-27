import Modal from "react-bootstrap/Modal";
import TimeSheetForm from "./TimeSheetForm.js";
import React from "react";
import moment from "moment";
import { Button, Col, Container, Row } from "react-bootstrap";

export function TimeSheetModal({
  show,
  handleClose,
  sheetEdit,
  setSheetEdit,
  onSaveCallBack,
  dateClickInfo,
}) {
  return (
    <Modal show={show} onHide={handleClose} size="lg">
      <TimeSheetForm
        handleClose={handleClose}
        sheetEdit={sheetEdit}
        setSheetEdit={setSheetEdit}
        onSaveCallBack={onSaveCallBack}
        dateClickInfo={dateClickInfo}
      />
    </Modal>
  );
}

export function TimeSheetViewModal({ show, handleClose, sheetView }) {
  const formatDateTime = (dateTime) => {
    return moment(dateTime).format("dddd, MMMM DD, YYYY");
  };

  const formatTime = (startTime, endTime) => {
    const start = moment(startTime, "HH:mm").format("h:mm A");
    const end = moment(endTime, "HH:mm").format("h:mm A");
    return `${start} - ${end}`;
  };

  return (
    <Modal show={show} onHide={handleClose} size="md">
      <Modal.Header>
        <Modal.Title>Shift Details</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Container>
          <Row>
            <Col md={12}>
              <Row className="mb-1">
                <Col md={4}>
                  <strong>Employee:</strong>
                </Col>
                <Col md={8}>{sheetView?.username}</Col>
              </Row>
              <Row className="mb-1">
                <Col md={4}>
                  <strong>Date:</strong>
                </Col>
                <Col md={8}>{formatDateTime(sheetView?.date)}</Col>
              </Row>
              <Row className="mb-1">
                <Col md={4}>
                  <strong>Time:</strong>
                </Col>
                <Col md={8}>
                  {formatTime(sheetView?.startTime, sheetView?.endTime)} •{" "}
                  {moment(sheetView?.endTime, "HH:mm").diff(
                    moment(sheetView?.startTime, "HH:mm"),
                    "hours"
                  )}
                  h (GMT+3)
                </Col>
              </Row>
              <Row className="mb-1">
                <Col md={4}>
                  <strong>Location:</strong>
                </Col>
                <Col md={8}>{sheetView?.location}</Col>
              </Row>
              <Row className="mb-1">
                <Col md={4}>
                  <strong>Event:</strong>
                </Col>
                <Col md={8}>{sheetView?.events}</Col>
              </Row>
              <Row className="mb-1">
                <Col md={4}>
                  <strong>Task:</strong>
                </Col>
                <Col md={8}>{sheetView?.tasks}</Col>
              </Row>
              <Row className="mb-1">
                <Col md={4}>
                  <strong>Client:</strong>
                </Col>
                <Col md={8}>{sheetView?.clientName}</Col>
              </Row>
            </Col>
          </Row>
        </Container>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
