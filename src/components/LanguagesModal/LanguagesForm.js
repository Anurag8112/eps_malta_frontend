import React from "react";
import axios from "axios";
import { useState } from "react";
import { Button, Modal, Form, Row, Col, Container } from "react-bootstrap";
import { toast, ToastContainer } from "react-toastify";

function LanguagesForm({
  handleClose,
  fetchLanguagesData = () => {},
  languagesDataEdit,
  setLanguagesDataEdit,
  onSaveCallBack = () => {},
}) {
  const [languages, setLanguageName] = useState(
    languagesDataEdit?.languages || ""
  );

  const languageId = languagesDataEdit?.id;

  const handleSubmit = async (event) => {
    event.preventDefault();
    event.stopPropagation();

    const language = event.currentTarget;

    if (language.checkValidity()) {
      try {
        if (languageId) {
          // Perform a PUT request if language
          await axios.put(`language/update/${languageId}`, {
            languages,
          });
          setLanguagesDataEdit("");
          toast.success("Language updated successfully!");
        } else {
          // Perform a POST request if language doesn't have an Data
          await axios.post("language/add", {
            languages: languages,
          });
          toast.success("Language added successfully!");
        }
        handleClose();
        fetchLanguagesData();
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
    language.classList.add("was-validated");
  };
  return (
    <>
      <Modal.Header>
        <Modal.Title id="example-modal-sizes-title-lg">
          {languageId ? "Edit Language" : "Add Language"}
        </Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          <Container>
            <Row>
              <Col md={12}>
                <Form.Group>
                  <Form.Label>Language</Form.Label>
                  <Form.Control
                    placeholder="Language"
                    type="text"
                    name="languages"
                    value={languages}
                    onChange={(e) => setLanguageName(e.target.value)}
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
            {languageId ? "UPDATE " : "SAVE"}
          </Button>
        </Modal.Footer>
      </Form>
      <ToastContainer position="top-center" autoClose={3000} hideProgressBar />
    </>
  );
}

export default LanguagesForm;
