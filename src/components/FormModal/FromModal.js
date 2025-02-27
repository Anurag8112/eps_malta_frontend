import Modal from "react-bootstrap/Modal";
import FromAddEdit from "./FormAddEdit.js";
import React from "react";

function FormModal({
  show,
  handleClose,
  fetchFormData,
  formDataEdit,
  setFormDataEdit,
}) {
  return (
    <Modal show={show} onHide={handleClose} size="lg">
      <FromAddEdit
        handleClose={handleClose}
        fetchFormData={fetchFormData}
        formDataEdit={formDataEdit}
        setFormDataEdit={setFormDataEdit}
      />
    </Modal>
  );
}

export default FormModal;
