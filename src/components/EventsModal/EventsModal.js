import Modal from "react-bootstrap/Modal";
import EventsForm from "./EventsForm.js";

import React from "react";

function EventsModal({
  show,
  handleClose,
  fetchEvents,
  eventEdit,
  setEventEdit,
  onSaveCallBack,
}) {
  return (
    <Modal show={show} onHide={handleClose}>
      <EventsForm
        handleClose={handleClose}
        fetchEvents={fetchEvents}
        eventEdit={eventEdit}
        setEventEdit={setEventEdit}
        onSaveCallBack={onSaveCallBack}
      />
    </Modal>
  );
}

export default EventsModal;
