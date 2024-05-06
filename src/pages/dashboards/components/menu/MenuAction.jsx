import React, { useState } from "react";
import { Box, IconButton, Menu, MenuItem, Tooltip } from "@mui/material";
import MoreVertRoundedIcon from "@mui/icons-material/MoreVertRounded";
import { MenuUserItem } from "./MenuUserItem";
function MenuAction(props) {
  const { event, data } = props;
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  return (
    <div>
      <IconButton
        id="demo-positioned-button"
        aria-controls={open ? "demo-positioned-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
      >
        <MoreVertRoundedIcon />
      </IconButton>
      <Menu
        id="demo-positioned-menu"
        aria-labelledby="demo-positioned-button"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "start",
            alignItems: "center",
            boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px;",
            mt: -2,
            padding: "0 10px",
          }}
        >
          {MenuUserItem.map((menu, index) => (
            <Tooltip key={index} title={menu?.title} placement="top">
              <IconButton
                disabled={data?.status !== "active" ? menu.disabled : false}
                onClick={() => {
                  event(menu.action, data);
                  setTimeout(() => {
                    setAnchorEl(null);
                  }, 100);
                }}
              >
                {menu.icon}
              </IconButton>
            </Tooltip>
          ))}
        </Box>
      </Menu>
    </div>
  );
}

export default MenuAction;
