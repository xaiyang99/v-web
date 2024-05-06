import { useState } from "react";

// material ui icon and component
import { Menu, MenuItem, styled } from "@mui/material";
import NormalButton from "../../../components/NormalButton";

const DropdownMenuContainer = styled("div")(() => ({
  width: "100%",
}));

const DropdownMenu = (props) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleOnClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const onEvent = (name) => {
    props.onEvent(name);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  return (
    <DropdownMenuContainer>
      <NormalButton onClick={handleOnClick}>{props.icon}</NormalButton>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        sx={{
          "& .MuiMenu-list": {
            padding: 0,
            "& .MuiMenuItem-root": {
              padding: "8px 14px",
              "--payment-invoice-icon": "#4B465C",
              "--payment-trash-icon": "#4B465C",
              "--payment-receipt-icon": "#4B465C",
              "&:hover": {
                background: "#E8F2F1",
                color: "#17766B",
                borderRadius: "6px",
                "--payment-invoice-icon": "#17766B",
                "--payment-trash-icon": "#17766B",
                "--payment-receipt-icon": "#17766B",
              },
            },
          },
        }}
        {...{
          ...props.MenuProps,
        }}
        PaperProps={{
          sx: {
            ...props.MenuProps?.PaperProps.sx,
            boxShadow: "0px 0px 5px rgba(0, 0, 0, 0.2)",
            padding: "8px",
          },
        }}
        keepMounted
      >
        {props.items?.map((item, index) => {
          return (
            <MenuItem
              disabled={item.isDisabled}
              onClick={() => {
                if (item.onClick) {
                  item.onClick();
                } else {
                  onEvent(item.value);
                }
              }}
              key={index}
            >
              <span
                className="icon"
                style={{
                  display: "flex",
                }}
              >
                {item?.icon}
              </span>
              <span
                className="text"
                style={{
                  marginLeft: "8px",
                }}
              >
                {item.name}
              </span>
            </MenuItem>
          );
        })}
      </Menu>
    </DropdownMenuContainer>
  );
};

export default DropdownMenu;
