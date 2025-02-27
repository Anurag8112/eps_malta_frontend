import Modal from "react-bootstrap/Modal";
import ClientForm from "./ClientForm.js";

import React from "react";

function ClientModal({
  show,
  handleClose,
  clientEdit,
  setClientEdit,
  fetchClient,
  onSaveCallBack,
}) {
  return (
    <Modal show={show} onHide={handleClose}>
      <ClientForm
        handleClose={handleClose}
        clientEdit={clientEdit}
        setClientEdit={setClientEdit}
        fetchClient={fetchClient}
        onSaveCallBack={onSaveCallBack}
      />
    </Modal>
  );
}

export default ClientModal;
