import React, {useState} from "react";
import { Modal, Card, Typography, Button, TextField} from "@mui/material";

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
        <Typography id="modal-modal-title" variant="h6" component="h2">
          {header}
        </Typography>
        <Typography id="modal-modal-description" sx={{ mt: 2 }}>
          {body}
        </Typography>
        <TextField id="outlined-basic" label="Outlined" variant="outlined" onChange={(event) => setTitle(event.target.value)} />
        <Button variant="contained" size="large" color="primary" sx={{marginTop:"2em"}} onClick={() => onClose(title)}>
  Submit
</Button>

      </Card>
    </Modal>
  );
};

export default NewMovieListModal;
