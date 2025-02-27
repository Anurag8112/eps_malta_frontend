import Modal from "react-bootstrap/Modal";
import CompaniesForm from "./CompaniesForm.js";

import React from "react";

function CompaniesModal({
  show,
  handleClose,
  fetchCompanies,
  companiesEdit,
  setCompaniesEdit,
}) {
  return (
    <Modal show={show} onHide={handleClose}>
      <CompaniesForm
        handleClose={handleClose}
        fetchCompanies={fetchCompanies}
        companiesEdit={companiesEdit}
        setCompaniesEdit={setCompaniesEdit}
      />
    </Modal>
  );
}

export default CompaniesModal;
