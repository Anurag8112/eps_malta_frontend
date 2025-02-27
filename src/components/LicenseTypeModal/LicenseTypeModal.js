import Modal from "react-bootstrap/Modal";
import LicenseTypeFrom from "./LicenseTypeForm.js";

import React from "react";

function LocationTypeModal({
  show,
  handleClose,
  linceseEdit,
  setLinceseEdit,
  fetchLicense,
}) {
  return (
    <Modal show={show} onHide={handleClose}>
      <LicenseTypeFrom
        handleClose={handleClose}
        linceseEdit={linceseEdit}
        setLinceseEdit={setLinceseEdit}
        fetchLicense={fetchLicense}
      />
    </Modal>
  );
}

export default LocationTypeModal;
