import React, {useState} from "react";
import { Modal, Card, Typography, Button, TextField, Grid} from "@mui/material";

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

const NewMovieListModal = ({ header, body, open, onClose }) => {
  const [title, setTitle] = useState("");
  return (
    <Modal open={open} onClose={onClose} aria-labelledby={header}>
      <Card sx={style} align="center">
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12}>
        <Typography id="modal-modal-title" variant="h6" component="h2">
          {header}
        </Typography>
          </Grid>
          <Grid item xs={12}>
        <Typography id="modal-modal-description" sx={{ mt: 2 }}>
          {body}
        </Typography>
          </Grid>
          <Grid item xs={12}>
        <TextField id="outlined-basic" label="Title" variant="outlined" onChange={(event) => setTitle(event.target.value)} />
          </Grid>
        <Grid item xs={12}>
        <Button variant="contained" size="large" color="primary" sx={{marginTop:"2em"}} onClick={() => onClose(title)}>
          Submit
        </Button>
        </Grid>
        </Grid>
      </Card>
    </Modal>
  );
};

export default NewMovieListModal;
