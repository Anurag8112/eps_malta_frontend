import { Modal, Button, Form, Row, Col } from "react-bootstrap";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useState } from "react";

function TasksForm({
  handleClose,
  fetchTasks = () => {},
  taskEdit,
  setTaskEdit,
  onSaveCallBack = () => {},
}) {
  const [tasks, setTasks] = useState(taskEdit?.tasks || "");
  const [description, setDescription] = useState(taskEdit?.description || "");
  const taskId = taskEdit?.id;

  const handleSubmit = async (event) => {
    event.preventDefault();
    event.stopPropagation();

    const form = event.currentTarget;

    if (form.checkValidity()) {
      try {
        if (taskId) {
          // Perform a PUT request if taskEdit has an ID
          await axios.put(`tasks/update/${taskId}`, {
            tasks,
            description,
          });
          setTaskEdit("");
          toast.success("Task updated successfully!");
        } else {
          // Perform a POST request if taskEdit doesn't have an ID
          await axios.post("tasks/add", {
            tasks: tasks,
            description: description,
          });
          toast.success("Task created successfully!");
        }

        handleClose();
        fetchTasks();
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

    form.classList.add("was-validated");
  };

  return (
    <>
      <Modal.Header>
        <Modal.Title>{taskId ? "Edit Tasks" : "Add Tasks"}</Modal.Title>
      </Modal.Header>
      <Form noValidate onSubmit={handleSubmit} className="needs-validation">
        <Modal.Body>
          <Row>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Tasks</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Tasks"
                  name="tasks"
                  value={tasks}
                  onChange={(e) => setTasks(e.target.value)}
                  required
                />
                <Form.Control.Feedback type="invalid">
                  Please provide a Tasks.
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Description</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Description"
                  name="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                />
                <Form.Control.Feedback type="invalid">
                  Please provide a description.
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
            {taskId ? "UPDATE" : "SAVE"}
          </Button>
        </Modal.Footer>
      </Form>
      <ToastContainer position="top-center" autoClose={3000} hideProgressBar />
    </>
  );
}

export default TasksForm;
