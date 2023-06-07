import React from "react";
import { Modal, Card, Typography, Button} from "@mui/material";

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
  };

const ErrorModal = ({ header, body, open, onClose }) => {
  return (
    <Modal open={open} onClose={onClose} aria-labelledby={header}>
      <Card sx={style} align="center">
        <Typography id="modal-modal-title" variant="h6" component="h2">
          {header}
        </Typography>
        <Typography id="modal-modal-description" sx={{ mt: 2 }}>
          {body}
        </Typography>
        <Button variant="contained" size="large" color="primary" sx={{marginTop:"2em"}} onClick={onClose}>
            Close
        </Button>
      </Card>
    </Modal>
  );
};

export default ErrorModal;
