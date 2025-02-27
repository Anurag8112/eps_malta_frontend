import React from "react";
import Modal from "react-bootstrap/Modal";
import LanguagesForm from "./LanguagesForm";

function LanguagesModal({
  show,
  handleClose,
  fetchLanguagesData,
  languagesDataEdit,
  setLanguagesDataEdit,
  onSaveCallBack,
}) {
  return (
    <Modal show={show} onHide={handleClose}>
      <LanguagesForm
        handleClose={handleClose}
        fetchLanguagesData={fetchLanguagesData}
        languagesDataEdit={languagesDataEdit}
        setLanguagesDataEdit={setLanguagesDataEdit}
        onSaveCallBack={onSaveCallBack}
      />
    </Modal>
  );
}

export default LanguagesModal;
