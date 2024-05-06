import {
  Box,
  Typography,
  Dialog,
  LinearProgress,
  DialogContent,
} from "@mui/material";

function CircularProgressBar(props) {
  const { value, isOpen } = props;

  return (
    <Dialog
      open={isOpen}
      PaperProps={{
        id: "dialog-v1",
        sx: {
          overflowY: "auto",
        },
        ...(props.PaperProps || {}),
      }}
      fullWidth={true}
      {...{
        ...props.dialogProps,
        sx: {
          // zIndex: 9999999999,
          zIndex: { ...(props.dialogProps.zIndex || 9999999999) },
          ...(props.dialogProps?.sx || {}),
        },
        PaperProps: {
          ...(props.dialogProps?.PaperProps || {}),
        },
        slotProps: {
          ...(props.dialogProps?.slotProps || {}),
        },
      }}
      keepMounted={false}
    >
      <DialogContent>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Box sx={{ width: "100%", mr: 1 }}>
            <LinearProgress variant="determinate" {...props} />
          </Box>
          <Box>
            <Typography variant="body2" color="text.secondary">{`${Math.round(
              value
            )}%`}</Typography>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
}

export default CircularProgressBar;
