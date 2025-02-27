import Modal from "react-bootstrap/Modal";
import LocationForm from "./LocationForm.js";

import React from "react";

function LocationModal({
  show,
  handleClose,
  fetchLocations,
  locationEdit,
  setLocationEdit,
  onSaveCallBack,
}) {
  return (
    <Modal show={show} onHide={handleClose}>
      <LocationForm
        handleClose={handleClose}
        fetchLocations={fetchLocations}
        locationEdit={locationEdit}
        setLocationEdit={setLocationEdit}
        onSaveCallBack={onSaveCallBack}
      />
    </Modal>
  );
}

export default LocationModal;
