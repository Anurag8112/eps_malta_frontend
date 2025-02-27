import React from "react";
import Modal from "react-bootstrap/Modal";
import QualificationsForm from "./QualificationsForm";

function QualificationsModal({
  show,
  handleClose,
  fetchQualificationData,
  qualificationDataEdit,
  setQualificationDataEdit,
  onSaveCallBack,
}) {
  return (
    <Modal show={show} onHide={handleClose}>
      <QualificationsForm
        handleClose={handleClose}
        fetchQualificationData={fetchQualificationData}
        qualificationDataEdit={qualificationDataEdit}
        setQualificationDataEdit={setQualificationDataEdit}
        onSaveCallBack={onSaveCallBack}
      />
    </Modal>
  );
}

export default QualificationsModal;
