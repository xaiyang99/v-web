import styled from "@emotion/styled";
import { NavLink } from "react-router-dom";

import { ListItemButton, Drawer as MuiDrawer } from "@mui/material";

import VshareLogo from "../../utils/images/vshare-black-logo.png";
import SidebarNav from "./SidebarNav";

const Drawer = styled(MuiDrawer)`
  border-right: 0;

  > div {Default
    border-right: 0;
  }
`;

const Brand = styled(ListItemButton)`
  font-size: ${(props) => props.theme.typography.h5.fontSize};
  font-weight: ${(props) => props.theme.typography.fontWeightMedium};
  color: ${(props) => props.theme.sidebar.header.color};
  background-color: ${(props) => props.theme.sidebar.header.background};
  font-family: ${(props) => props.theme.typography.fontFamily};
  min-height: 56px;
  padding-left: ${(props) => props.theme.spacing(6)};
  padding-right: ${(props) => props.theme.spacing(6)};
  justify-content: center;
  cursor: pointer;
  flex-grow: 0;

  ${(props) => props.theme.breakpoints.up("sm")} {
    min-height: 64px;
  }

  &:hover {
    background-color: ${(props) => props.theme.sidebar.header.background};
  }
`;

// const Sidebar = ({ items, showFooter = true, ...rest }) => {
const Sidebar = ({ items = true, ...rest }) => {
  return (
    <Drawer variant="permanent" {...rest}>
      <Brand
        component={NavLink}
        to="/"
        sx={{ cursor: "pointer", "&:hover": { background: "#ffffff" } }}
      >
        <img src={VshareLogo} alt="v-share logo" width={200} height={50} />
      </Brand>
      <SidebarNav items={items} />
    </Drawer>
  );
};

export default Sidebar;
