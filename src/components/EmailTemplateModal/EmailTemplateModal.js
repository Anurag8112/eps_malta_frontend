import Modal from "react-bootstrap/Modal";
import EmailTemplateForm from "./EmailTemplateForm.js";

import React from "react";

function EmailTemplateModal({
  show,
  handleClose,
  fetchEmailTemplate,
  emailTemplateEdit,
  setEmailTemplateEdit,
}) {
  return (
    <Modal show={show} onHide={handleClose}>
      <EmailTemplateForm
        handleClose={handleClose}
        fetchEmailTemplate={fetchEmailTemplate}
        emailTemplateEdit={emailTemplateEdit}
        setEmailTemplateEdit={setEmailTemplateEdit}
      />
    </Modal>
  );
}

export default EmailTemplateModal;
