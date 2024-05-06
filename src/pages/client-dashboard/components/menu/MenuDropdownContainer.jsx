import React, { useEffect, useState } from "react";

//mui component and style
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Menu from "@mui/material/Menu";
import { styled } from "@mui/material/styles";
import { useMenuDropdownState } from "./MenuDropdownProvider";
import "./menuDropdown.css";

const MenuDropdownContainerStyled = styled("div")({
  position: "relative",
});

export const MenuDropdownButton = styled("button")({
  borderRadius: "50%",
  border: 0,
  backgroundColor: "white",
  display: "flex",
  justifyContent: "center",
  width: "25px",
  cursor: "pointer",
});

const MenuListContainer = styled("div")({
  ".MuiMenu-list": {
    padding: 0,
    ".menu-item": {
      columnGap: "10px",
      fontSize: "14px",
      svg: {
        fontSize: "16px",
      },
      ":hover": {
        color: "#17766B",
        backgroundColor: "rgba(22,118,107,0.04)",
      },
    },
  },
});

// const MenuDropdownContainer = ({ menuAction, ...props }) => {
const MenuDropdownContainer = ({ ...props }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const { isAutoClose, setIsAutoClose } = useMenuDropdownState();
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  // const handleClose = (event, reason) => {
  const handleClose = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    if (isAutoClose) {
      setAnchorEl(null);
      setTimeout(() => {
        setIsAutoClose(false);
      }, 0);
    }
  }, [isAutoClose]);

  useEffect(() => {
    props.onOpenChange?.(open);
  }, [open]);

  return (
    <MenuDropdownContainerStyled>
      {props.customButton ? (
        <>
          {React.cloneElement(props.customButton.element, {
            id: "dropdown-button",
            "aria-controls": open ? "dropdown-menu" : undefined,
            "aria-haspopup": "true",
            "aria-expanded": open ? "true" : undefined,
            ...props.customButton.props,
            onClick: (e) => {
              handleClick(e);
              props.customButton.props?.onClick?.(e);
            },
          })}
        </>
      ) : (
        <MenuDropdownButton
          id="dropdown-button"
          aria-controls={open ? "dropdown-menu" : undefined}
          aria-haspopup="true"
          aria-expanded={open ? "true" : undefined}
          onClick={handleClick}
        >
          <MoreVertIcon style={{ color: "#4B465C" }} />
        </MenuDropdownButton>
      )}

      <MenuListContainer>
        <Menu
          id="dropdown-menu"
          anchorEl={anchorEl}
          open={open}
          sx={{
            cursor: "default",
          }}
          PaperProps={{
            style: {
              position: "relative",
              width: "max-content",
              boxShadow: "0px 0px 5px rgba(0, 0, 0, 0.05)",
            },
          }}
          style={{
            marginTop: "5px",
            padding: "0 !important",
          }}
          onClose={handleClose}
          MenuListProps={{
            "aria-labelledby": "dropdown-button",
          }}
          disablePortal={props.customButton?.element ? false : true}
          disableScrollLock
        >
          {props.children}
        </Menu>
      </MenuListContainer>
    </MenuDropdownContainerStyled>
  );
};

export default MenuDropdownContainer;
