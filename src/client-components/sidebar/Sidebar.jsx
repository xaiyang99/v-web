import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import styled from "@emotion/styled";

// components
import SidebarNav from "./SidebarNav";
import VshareLogo from "../../utils/images/vshare-black-logo.png";

// material ui folder
import {
  Drawer as MuiDrawer,
  ListItemButton,
  Box,
  Typography,
  Button,
} from "@mui/material";
const Drawer = styled(MuiDrawer)``;
const Brand = styled(ListItemButton)`
  font-size: ${(props) => props.theme.typography.h5.fontSize};
  font-weight: ${(props) => props.theme.typography.fontWeightMedium};
  color: ${(props) => props.theme.sidebar.header.color};
  font-family: ${(props) => props.theme.typography.fontFamily};
  min-height: 56px;
  padding-bottom: ${(props) => props.theme.spacing(6)};
  padding-top: ${(props) => props.theme.spacing(6)};
  padding-left: ${(props) => props.theme.spacing(6)};
  padding-right: ${(props) => props.theme.spacing(6)};
  justify-content: center;
  cursor: pointer;
  flex-grow: 0;
  ${(props) => props.theme.breakpoints.up("sm")} {
    min-height: 64px;
  }
`;
// const Sidebar = ({ items, showFooter = true, ...rest }) => {
const Sidebar = ({ items = true, ...rest }) => {
  const navigate = useNavigate();
  return (
    <Drawer variant="permanent" {...rest}>
      <Brand
        component={NavLink}
        to="/dashboard"
        sx={{ cursor: "pointer", "&:hover": { background: "#ffffff" } }}
      >
        <img src={VshareLogo} alt="v-share logo" width={200} height={50} />
      </Brand>
      <Box sx={{ m: 4 }}>
        <SidebarNav items={items} />
      </Box>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          marginTop: "40%",
        }}
      >
        <Typography variant="h5" sx={{ color: "#5D596C" }}>
          We're launching the beta version
        </Typography>
        <Button
          sx={{ mt: 2 }}
          variant="contained"
          color="primaryTheme"
          onClick={() => navigate("/feedback")}
        >
          Your feedback is valued
        </Button>
      </Box>
    </Drawer>
  );
};

export default Sidebar;
