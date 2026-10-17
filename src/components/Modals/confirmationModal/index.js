import React from "react";
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";

const ConfirmationModal = ({ header, subHeader, body, open, onClose, onConfirm, confirmLabel = "Confirm", destructive = true }) => {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle>{header}</DialogTitle>
      <DialogContent>
        {subHeader && <DialogContentText sx={{ mb: 1 }}>{subHeader}</DialogContentText>}
        {body && <DialogContentText>{body}</DialogContentText>}
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} color="inherit">Cancel</Button>
        <Button onClick={onConfirm} variant="contained" color={destructive ? "error" : "primary"}>{confirmLabel}</Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmationModal;
