import React from "react";
import ConfirmationModal from "../confirmationModal";

const LeaveConfirmationModal = ({ header, body, open, onClose, onLeave }) => (
  <ConfirmationModal header={header} body={body} open={open} onClose={onClose} onConfirm={onLeave} confirmLabel="Leave" />
);

export default LeaveConfirmationModal;
