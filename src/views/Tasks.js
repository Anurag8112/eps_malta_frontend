import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, Container, Row, Col, Button, Spinner } from "react-bootstrap";
import TaskModal from "../components/TasksModal/TasksModal.js";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";

function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [taskEdit, setTaskEdit] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const fetchTasks = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get("tasks/view");
      const data = response.data.map((row, index) => ({
        ...row,
        "S NO.": index + 1,
      }));
      setTasks(data);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleTasksDelete = async (taskId) => {
    try {
      const confirmDelete = window.confirm(
        "Are you sure you want to delete this task?"
      );
      if (confirmDelete) {
        await axios.delete(`tasks/delete/${taskId}`);
        const updatedTasks = tasks.filter((task) => task.id !== taskId);
        setTasks(updatedTasks);
        toast.success("Task deleted successfully!");
        fetchTasks();
      }
    } catch (error) {
      toast.error("Failed to delete task.");
      console.log(error);
    }
  };

  const onTaskAdd = () => {
    setDialogOpen(true);
  };

  const onTaskEdit = (taskEdit) => {
    setTaskEdit(taskEdit);
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setTaskEdit("");
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
      dataField: "tasks",
      text: "Tasks",
      sort: true,
      headerClasses: "border-0",
      classes: "border-0",
      headerStyle: { width: "200px" },
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
              onTaskEdit(row);
            }}
          >
            EDIT
          </Button>{" "}
          <Button
            variant="danger"
            size="sm"
            onClick={() => handleTasksDelete(row.id)}
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
                  <Card.Title as="h4">Tasks</Card.Title>
                  <p className="card-category">Show All Tasks</p>
                </div>
                <Button variant="primary" onClick={onTaskAdd}>
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
                    data={tasks}
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
      <TaskModal
        show={dialogOpen}
        handleClose={handleDialogClose}
        fetchTasks={fetchTasks}
        taskEdit={taskEdit}
        setTaskEdit={setTaskEdit}
      />
      <ToastContainer position="top-center" autoClose={3000} hideProgressBar />
    </>
  );
}

export default Tasks;
