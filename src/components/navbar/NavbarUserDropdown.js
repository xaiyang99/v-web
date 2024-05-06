import React from "react";
import { styled } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import * as MUI from "./css/style";

import {
  Avatar,
  Divider,
  Grid,
  Menu,
  IconButton as MuiIconButton,
  Tooltip,
  Typography,
} from "@mui/material";

import LogoutIcon from "@mui/icons-material/Logout";
import ManageAccountsOutlinedIcon from "@mui/icons-material/ManageAccountsOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";

const IconButton = styled(MuiIconButton)`
  svg {
    width: 22px;
    height: 22px;
  }
`;

function NavbarUserDropdown() {
  const { user } = useAuth();
  const [anchorMenu, setAnchorMenu] = React.useState(null);
  const navigate = useNavigate();
  const { logOut } = useAuth();

  const toggleMenu = (event) => {
    setAnchorMenu(event.currentTarget);
  };

  const closeMenu = () => {
    setAnchorMenu(null);
  };

  const handleSignOut = async () => {
    await logOut();
    navigate("/admin/login");
  };

  return (
    <React.Fragment>
      <Grid
        container
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Grid item>
          <Tooltip title="Account">
            <IconButton
              sx={{
                padding: 0,
              }}
              aria-owns={anchorMenu ? "menu-appbar" : undefined}
              aria-haspopup="true"
              onClick={toggleMenu}
              color="inherit"
              size="large"
            >
              <Avatar
                alt={user?.firstname}
                src={
                  process.env.REACT_APP_BUNNY_PULL_ZONE +
                  user?.newName +
                  "-" +
                  user?._id +
                  "/" +
                  process.env.REACT_APP_ZONE_PROFILE +
                  "/" +
                  user?.addProfile
                }
              />
            </IconButton>
          </Tooltip>
        </Grid>
      </Grid>
      <Menu
        id="menu-appbar"
        anchorEl={anchorMenu}
        open={Boolean(anchorMenu)}
        onClose={closeMenu}
      >
        <MUI.BoxShowDropDown>
          <MUI.BoxShowCurrentUser>
            <Avatar
              alt={user?.firstname}
              src={
                process.env.REACT_APP_BUNNY_PULL_ZONE +
                user?.newName +
                "-" +
                user?._id +
                "/" +
                process.env.REACT_APP_ZONE_PROFILE +
                "/" +
                user?.addProfile
              }
            />
            <MUI.BoxShowCurrentUserDetail>
              <Typography variant="h6">
                {user?.firstname + " " + user?.lastname}
              </Typography>
              <Typography variant="h6">{user?.email}</Typography>
            </MUI.BoxShowCurrentUserDetail>
          </MUI.BoxShowCurrentUser>
          <Divider sx={{ margin: "0.8rem 0" }} />
          <MUI.MenuItems
            onClick={() => {
              navigate("/dashboard/profile", { state: 1 });
              closeMenu();
            }}
          >
            <ManageAccountsOutlinedIcon sx={{ fontSize: "20px" }} />
            &nbsp; Profile
          </MUI.MenuItems>
          <MUI.MenuItems
            onClick={() => {
              navigate("/dashboard/settings", { state: 1 });
              closeMenu();
            }}
          >
            <SettingsOutlinedIcon sx={{ fontSize: "20px" }} />
            &nbsp; Setting
          </MUI.MenuItems>
          <Divider sx={{ margin: "0.8rem 0" }} />
          <MUI.MenuItems onClick={handleSignOut}>
            <LogoutIcon sx={{ fontSize: "20px" }} />
            &nbsp; Sign out
          </MUI.MenuItems>
        </MUI.BoxShowDropDown>
      </Menu>
    </React.Fragment>
  );
}

export default NavbarUserDropdown;
