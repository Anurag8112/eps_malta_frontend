import React from "react";
import Modal from "react-bootstrap/Modal";
import SkillsForm from "./SkillsForm";

function SkillsModal({
  show,
  handleClose,
  fetchSkillsData,
  skillsDataEdit,
  setSkillsDataEdit,
  onSaveCallBack,
}) {
  return (
    <Modal show={show} onHide={handleClose}>
      <SkillsForm
        handleClose={handleClose}
        fetchSkillsData={fetchSkillsData}
        skillsDataEdit={skillsDataEdit}
        setSkillsDataEdit={setSkillsDataEdit}
        onSaveCallBack={onSaveCallBack}
      />
    </Modal>
  );
}

export default SkillsModal;
