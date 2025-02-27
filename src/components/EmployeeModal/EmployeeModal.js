import Modal from "react-bootstrap/Modal";
import EmployeeForm from "./EmployeeForm.js";

import React from "react";
import { Button, Col, Container, Row } from "react-bootstrap";

export function EmployeeModal({
  show,
  handleClose,
  fetchEmployees,
  employeeEdit,
  setEmployeeEdit,
}) {
  return (
    <Modal show={show} onHide={handleClose}>
      <EmployeeForm
        handleClose={handleClose}
        fetchEmployees={fetchEmployees}
        employeeEdit={employeeEdit}
        setEmployeeEdit={setEmployeeEdit}
      />
    </Modal>
  );
}

export function EmployeeViewModal({ show, handleClose, employeeView }) {
  return (
    <Modal show={show} onHide={handleClose} size="lg">
      <Modal.Header>
        <Modal.Title>Employee Details</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Container>
          <Row>
            <Col md={6}>
              <Row className="mb-1">
                <Col md={4}>
                  <strong>Name:</strong>
                </Col>
                <Col md={8}>{employeeView?.username}</Col>
              </Row>
              <Row className="mb-1">
                <Col md={4}>
                  <strong>Email:</strong>
                </Col>
                <Col md={8}>{employeeView?.email}</Col>
              </Row>
              <Row className="mb-1">
                <Col md={4}>
                  <strong>Mobile:</strong>
                </Col>
                <Col md={8}>{employeeView?.mobile}</Col>
              </Row>
              <Row className="mb-1">
                <Col md={4}>
                  <strong>Role:</strong>
                </Col>
                <Col md={8}>
                  {employeeView?.role === "1" && "Admin"}
                  {employeeView?.role === "2" && "Employee"}
                  {employeeView?.role === "3" && "Manager"}
                </Col>{" "}
              </Row>
              <Row className="mb-1">
                <Col md={4}>
                  <strong>Status:</strong>
                </Col>
                <Col md={8}>
                  {employeeView?.status === "1" ? "Active" : "Inactive"}
                </Col>
              </Row>
            </Col>
            <Col md={6}>
              <Row className="mb-1">
                <Col md={4}>
                  <strong>Qualifications:</strong>
                </Col>
                <Col md={8}>
                  {employeeView?.qualifications?.map((qualification) => (
                    <div key={qualification.value}>{qualification.label}</div>
                  ))}
                </Col>
              </Row>
              <Row className="mb-1">
                <Col md={4}>
                  <strong>Skills:</strong>
                </Col>
                <Col md={8}>
                  {employeeView?.skills?.map((skill) => (
                    <div key={skill.value}>{skill.label}</div>
                  ))}
                </Col>
              </Row>
              <Row className="mb-1">
                <Col md={4}>
                  <strong>Languages:</strong>
                </Col>
                <Col md={8}>
                  {employeeView?.languages?.map((language) => (
                    <div key={language.value}>{language.label}</div>
                  ))}
                </Col>
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
