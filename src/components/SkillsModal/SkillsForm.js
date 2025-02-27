import axios from "axios";
import React, { useState } from "react";
import { Button, Modal, Form, Row, Col, Container } from "react-bootstrap";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function SkillForm({
  handleClose,
  fetchSkillsData = () => {},
  skillsDataEdit,
  setSkillsDataEdit,
  onSaveCallBack = () => {},
}) {
  const [skills, setSkillsName] = useState(skillsDataEdit?.skills || "");

  const skillsId = skillsDataEdit?.id;

  const handleSubmit = async (event) => {
    event.preventDefault();
    event.stopPropagation();

    const skill = event.currentTarget;

    if (skill.checkValidity()) {
      try {
        if (skillsId) {
          // Perform a PUT request if skills
          await axios.put(`skill/update/${skillsId}`, {
            skills,
          });
          setSkillsDataEdit("");
          toast.success("Skill updated successfully!");
        } else {
          // Perform a POST request if skills doesn't have an Data
          await axios.post("skill/add", {
            skills,
          });
          toast.success("Skill added successfully!");
        }
        handleClose();
        fetchSkillsData();
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
    skill.classList.add("was-validated");
  };
  return (
    <>
      <Modal.Header>
        <Modal.Title id="example-modal-sizes-title-lg">
          {skillsId ? "Edit skill " : "Add skill"}
        </Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          <Container>
            <Row>
              <Col md={12}>
                <Form.Group>
                  <Form.Label>Skills</Form.Label>
                  <Form.Control
                    placeholder="Skills"
                    type="text"
                    name="skills"
                    value={skills}
                    onChange={(e) => setSkillsName(e.target.value)}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
          </Container>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            CLOSE
          </Button>
          <Button variant="primary" type="submit">
            {skillsId ? "UPDATE " : "SAVE"}
          </Button>
        </Modal.Footer>
      </Form>
      <ToastContainer position="top-center" autoClose={3000} hideProgressBar />
    </>
  );
}

export default SkillForm;
