import React from "react";
import { Button, Tooltip } from "@mui/material";

function ButtonComponent(props) {
  return (
    <Tooltip title={props.tooltipTitle}>
      <Button
        variant={props.variant ? props.variant : "contained"}
        color={props.color ? props.color : "primary"}
        startIcon={props.startIcon ? props.startIcon : ""}
        endIcon={props.endIcon ? props.endIcon : ""}
        onClick={props.handleOnClick}
        size={props.size ? props.size : "medium"}
        sx={props.style}
        type={props.type}
        fullWidth={props.fullWidth}
      >
        {props.label ? props.label : "My Button"}
      </Button>
    </Tooltip>
  );
}

export default ButtonComponent;
