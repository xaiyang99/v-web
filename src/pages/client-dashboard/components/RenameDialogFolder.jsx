import { Button, TextField } from "@mui/material";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { Box } from "@mui/system";

const RenameDialog = (props) => {
  const { open, onClose, onClick, title, name, setName, label } = props;

  return (
    <Dialog open={open} onClose={onClose}>
      <Box sx={{ width: "350px" }}>
        <DialogTitle sx={{ mt: 2 }}>{title}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label={label}
            type="text"
            fullWidth
            variant="standard"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </DialogContent>
        <DialogActions sx={{ mb: 3, mr: 3 }}>
          <Button
            onClick={onClose}
            variant="contained"
            color="error"
            sx={{ borderRadius: "6px" }}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="contained"
            sx={{ borderRadius: "6px" }}
            color="primaryTheme"
            onClick={onClick}
          >
            Save Change
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
};

export default RenameDialog;
