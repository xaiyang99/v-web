import React, { useState } from "react";

import { styled } from "@mui/material/styles";

const RadialButtonContainer = styled("div")(({ theme, ...props }) => ({
  position: "relative",
  width: "60px",
  height: "60px",
  display: "flex",
  fontSize: "2rem",
  fontWeight: "bold",
  justifyContent: "center",
  alignItems: "center",
  borderRadius: "50%",
  background: "#2196F3",
  color: "#fff",
  border: "none",
  cursor: "pointer",
  outline: "none",
  "&:hover": {
    background: "#1976D2",
  },
}));

const SplitButton = styled("div")(({ theme, ...props }) => ({
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: `translate(-50%, -50%) rotate(${props.angle}deg)`,
  width: "40px",
  height: "40px",
  borderRadius: "50%",
  background: "#E91E63",
  color: "#fff",
  border: "none",
  cursor: "pointer",
  outline: "none",

  "&:hover": {
    background: "#C2185B",
  },
}));

function RadialButton({ options, ...props }) {
  const [isOpen, setIsOpen] = useState(false);

  const handleMenuClick = () => {
    setIsOpen(!isOpen);
  };
  return (
    <>
      <RadialButtonContainer>{isOpen ? "-" : "+"}</RadialButtonContainer>
      {options &&
        options.map((option, index) => (
          <SplitButton
            key={index}
            angle={(360 / options.length) * index}
            onClick={() => option.onClick()}
          >
            {option.label}
          </SplitButton>
        ))}
    </>
  );
}

export default RadialButton;
