import Modal from "react-bootstrap/Modal";
import LicenseReportForm from "./LicenseReportForm.js";

import React from "react";

function LicenseReportModal({
  show,
  handleClose,
  licenseReportEdit,
  fetchLicenseData,
  setLicenseReportEdit,
}) {
  return (
    <Modal show={show} onHide={handleClose} size="lg">
      <LicenseReportForm
        handleClose={handleClose}
        licenseReportEdit={licenseReportEdit}
        fetchLicenseData={fetchLicenseData}
        setLicenseReportEdit={setLicenseReportEdit}
      />
    </Modal>
  );
}

export default LicenseReportModal;
