import Modal from "react-bootstrap/Modal";
import TemplateForm from "./TemplateForm.js";

import React from "react";

function TemplateModal({
  show,
  handleClose,
  templateEdit,
  setTemplateEdit,
  fetchTemplate,
}) {
  return (
    <Modal show={show} onHide={handleClose}>
      <TemplateForm
        handleClose={handleClose}
        templateEdit={templateEdit}
        setTemplateEdit={setTemplateEdit}
        fetchTemplate={fetchTemplate}
      />
    </Modal>
  );
}

export default TemplateModal;
