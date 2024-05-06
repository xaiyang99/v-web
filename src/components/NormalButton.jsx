import { styled as muiStyled } from "@mui/material";
import React from "react";

const NormalButtonContainer = muiStyled("button")({
  cursor: "pointer",
  display: "flex",
  padding: 0,
  border: "none",
  borderRadius: "6px",
  fontSize: "inherit",
  fontFamily: "inherit",
  width: "100%",
  height: "100%",
  background: "transparent",
});

const NormalButton = React.forwardRef(({ children, ...props }, ref) => {
  return (
    <NormalButtonContainer
      ref={ref}
      {...{
        type: "button",
        ...props,
      }}
    >
      {children}
    </NormalButtonContainer>
  );
});

export default NormalButton;
