import { Button, TextField, Tooltip, Typography } from "@mui/material";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import { tooltipClasses } from "@mui/material/Tooltip";
import { Box } from "@mui/system";
import { useEffect, useMemo, useRef, useState } from "react";
import { getFileNameExtension } from "../../../functions";

const RenameDialogFile = (props) => {
  const {
    open,
    onClose,
    onSave,
    title,
    name,
    label,
    detail,
    isFolder,
    setName,
  } = props;

  const [data, setData] = useState({
    name: "",
    extension: "",
  });

  const defaultValue = useMemo(() => props.defaultValue, [props.defaultValue]);

  const defaultValueExtension = getFileNameExtension(defaultValue);

  const inputRef = useRef(null);

  const [isTooltipOpen, setIsTooltipOpen] = useState(false);

  const handleOnAutoFocus = () => {
    const inputElement = inputRef.current;
    if (inputElement) {
      const fileName = inputElement.value;
      if (isFolder) {
        inputRef.current.focus();
        return false;
      } else {
        const extensionIndex = fileName.lastIndexOf(".");
        const cursorPosition =
          extensionIndex !== -1 ? extensionIndex : fileName.length;
        if (
          cursorPosition !== -1 &&
          inputRef.current.selectionStart > cursorPosition
        ) {
          inputRef.current.focus();
          inputRef.current.setSelectionRange(cursorPosition, cursorPosition);
          return true;
        }
      }
    }
  };

  const handleOnChange = (e) => {
    const isAfterTheLastDot = handleOnAutoFocus();
    if (!isAfterTheLastDot) {
      let value = e.target.value;
      if (!/[\\/:*?"'<>]/.test(value)) {
        const valueExtensionIndex = value.lastIndexOf(".");
        const valueExtension = value.substring(valueExtensionIndex);
        setIsTooltipOpen(false);
        setData((prevState) => ({
          ...prevState,
          name: isFolder
            ? value
            : valueExtension === defaultValueExtension
              ? value
              : value + defaultValueExtension,
        }));
      } else {
        setIsTooltipOpen(true);
        setData((prevState) => ({
          ...prevState,
        }));
      }
    } else {
      setData((prevState) => ({
        ...prevState,
      }));
    }
  };

  const handleOnBlur = () => {
    if (isFolder) {
      if (!data.name) {
        setData((prevState) => ({
          ...prevState,
          name: defaultValue,
        }));
      }
    } else {
      if (data.name === defaultValueExtension) {
        setData((prevState) => ({
          ...prevState,
          name: defaultValue,
        }));
      }
    }
  };

  const handleOnClose = () => {
    setIsTooltipOpen(false);
    onClose();
  };

  const handleOnSave = async () => {
    if (!data.name) {
      return;
    }
    onSave?.(data.name);
  };

  useEffect(() => {
    setData({
      name,
      extension: getFileNameExtension(name),
    });
  }, [name, open]);

  useEffect(() => {
    handleOnAutoFocus();
    if (data.name) {
      setName?.(data.name);
    }
  }, [data]);

  useEffect(() => {
    return () => {
      setIsTooltipOpen(false);
    };
  }, []);

  return (
    <Dialog
      open={open}
      fullWidth
      onClose={handleOnClose}
      maxWidth="sm"
      {...props.dialogProps}
    >
      <Box>
        <DialogContent>
          <Typography variant="h4" sx={{ mt: 2, mb: 2 }}>
            {title}
          </Typography>
          <Tooltip
            arrow
            placement="bottom-start"
            onClose={() => setIsTooltipOpen(false)}
            PopperProps={{
              sx: {
                [`& .${tooltipClasses.arrow}`]: {
                  left: "-200px !important",
                },
              },
            }}
            open={isTooltipOpen}
            disableFocusListener
            disableHoverListener
            disableTouchListener
            title={
              "A file name can't contain any of the following characters: \\/:*?\"'<>"
            }
          >
            <TextField
              inputRef={inputRef}
              inputProps={{
                onClick: handleOnAutoFocus,
              }}
              margin="dense"
              type="text"
              fullWidth
              variant="outlined"
              error={data.name ? false : true}
              value={data.name || ""}
              onChange={handleOnChange}
              onBlur={handleOnBlur}
            />
          </Tooltip>
        </DialogContent>
        <DialogActions sx={{ mb: 3, mr: 3 }}>
          <Button
            onClick={handleOnClose}
            variant="contained"
            color="secondaryTheme"
            sx={{ borderRadius: "6px" }}
          >
            Cancel
          </Button>
          <Button
            sx={{ borderRadius: "6px" }}
            type="button"
            variant="contained"
            color="primaryTheme"
            onClick={handleOnSave}
          >
            Save Change
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
};

export default RenameDialogFile;
