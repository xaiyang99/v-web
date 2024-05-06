import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import { Typography } from "@mui/material";

export default function FormDialog(props) {
  const { open, onClose, onData, OriginalName, newName } = props;
  const [name, setName] = React.useState(newName);
  const [updateName, setUpdateName] = React.useState(OriginalName);

  React.useEffect(() => {
    setName(newName);
    setUpdateName(OriginalName);
  }, [newName, OriginalName]);

  const handleClose = () => {
    onClose(false);
  };

  const updateState = () => {
    if (props.newName) {
      onData(name);
    } else {
      onData(updateName);
    }
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogContent>
        <Typography sx={{ textAlign: "center" }}>
          {!props.newName ? "Rename" : "The"}&nbsp;&nbsp;
          <strong style={{ color: "red" }}>{OriginalName}</strong>&nbsp;&nbsp;
          {!props.newName ? "" : "is already exist!"}
        </Typography>
        <TextField
          autoFocus
          margin="dense"
          id="file"
          type="text"
          fullWidth
          variant="standard"
          value={newName ? name : updateName}
          onChange={(event) =>
            newName
              ? setName(event.target.value)
              : setUpdateName(event.target.value)
          }
        />
        <Typography sx={{ color: "green" }} variant="h5" mt={3}>
          {!props.newName
            ? "Enter the name which you want to update!"
            : "Do you want to rename it with the suggested name?"}
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} variant="contained" color="error">
          Cancel
        </Button>
        <Button onClick={updateState} variant="contained" color="primary">
          Rename
        </Button>
      </DialogActions>
    </Dialog>
  );
}
