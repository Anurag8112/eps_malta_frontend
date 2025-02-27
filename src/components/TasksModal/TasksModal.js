import Modal from "react-bootstrap/Modal";
import TasksForm from "./TasksForm.js";

import React from "react";

function Tasksmodal({
  show,
  handleClose,
  fetchTasks,
  taskEdit,
  setTaskEdit,
  onSaveCallBack,
}) {
  return (
    <Modal show={show} onHide={handleClose}>
      <TasksForm
        handleClose={handleClose}
        fetchTasks={fetchTasks}
        taskEdit={taskEdit}
        setTaskEdit={setTaskEdit}
        onSaveCallBack={onSaveCallBack}
      />
    </Modal>
  );
}

export default Tasksmodal;
