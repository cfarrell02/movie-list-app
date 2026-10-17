import React, { useEffect, useState } from "react";
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField } from "@mui/material";

// onClose(title) creates the list; onCancel dismisses without creating
const NewMovieListModal = ({ header, title: heading, body, open, onClose, onCancel }) => {
  const [title, setTitle] = useState("");

  useEffect(() => {
    if (open) setTitle("");
  }, [open]);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (title.trim()) onClose(title.trim());
  };

  return (
    <Dialog open={open} onClose={onCancel} fullWidth maxWidth="xs" PaperProps={{ component: "form", onSubmit: handleSubmit }}>
      <DialogTitle>{header || heading}</DialogTitle>
      <DialogContent>
        {body && <DialogContentText sx={{ mb: 2 }}>{body}</DialogContentText>}
        <TextField autoFocus fullWidth label="List name" value={title} onChange={(event) => setTitle(event.target.value)} />
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onCancel} color="inherit">Cancel</Button>
        <Button type="submit" variant="contained" disabled={!title.trim()}>Create list</Button>
      </DialogActions>
    </Dialog>
  );
};

export default NewMovieListModal;
