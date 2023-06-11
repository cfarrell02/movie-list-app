import React from "react";
import { Modal, Card, Typography, Button, Grid} from "@mui/material";

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

const LeaveConfirmationModal = ({ header, body, open, onClose, onLeave }) => {
  return (
    <Modal open={open} onClose={onClose} aria-labelledby={header}>
      <Card sx={style} align="center">
        <Typography id="modal-modal-title" variant="h6" component="h2">
          {header}
        </Typography>
        <Typography id="modal-modal-description" sx={{ mt: 2 }}>
          {body}
        </Typography>
        <Grid container spacing={2} sx={{marginTop:"2em"}}>
            <Grid item xs={6}>
        <Button variant="contained" size="large" color="primary" sx={{marginTop:"2em"}} onClick={onClose}>
              Close
        </Button>
        </Grid>
        <Grid item xs={6}>
        <Button variant="contained" size="large" color="primary" sx={{marginTop:"2em"}} onClick={onLeave}>
              Leave
        </Button>
        </Grid>
        </Grid>
      </Card>
    </Modal>
  );
};

export default LeaveConfirmationModal;
