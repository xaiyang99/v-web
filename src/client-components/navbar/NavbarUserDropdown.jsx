import React, { useEffect, useState } from "react";
import { styled } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import * as MUI from "./css/style";
// material ui icons and components
import { useLazyQuery } from "@apollo/client";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import CameraOutlinedIcon from "@mui/icons-material/CameraOutlined";
import HelpOutlineOutlinedIcon from "@mui/icons-material/HelpOutlineOutlined";
import LogoutIcon from "@mui/icons-material/Logout";
import ManageAccountsOutlinedIcon from "@mui/icons-material/ManageAccountsOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import {
  Avatar,
  Divider,
  Grid,
  Menu,
  IconButton as MuiIconButton,
  Tooltip,
  Typography,
} from "@mui/material";
import { EventUploadTriggerContext } from "../../contexts/EventUploadTriggerContext";
import { QUERY_USER_ACCOUNT } from "../../pages/client-dashboard/account-info/apollo";

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
  const { signOut } = useAuth();
  const [queryUser] = useLazyQuery(QUERY_USER_ACCOUNT, {
    fetchPolicy: "no-cache",
  });
  const eventUploadTrigger = React.useContext(EventUploadTriggerContext);
  const toggleMenu = (event) => {
    setAnchorMenu(event.currentTarget);
  };
  const [userAccount, setUserAccount] = useState({});
  const handleGetUser = async () => {
    if (user?._id) {
      await queryUser({
        variables: {
          where: {
            _id: user?._id,
          },
        },
        onCompleted: (data) => {
          if (data?.getUser?.data.length > 0) {
            setUserAccount(data?.getUser?.data[0]);
          }
        },
      });
    }
  };
  
  React.useEffect(() => {
    handleGetUser();
  }, [user]);

  const closeMenu = () => {
    setAnchorMenu(null);
  };

  useEffect(() => {
    if (eventUploadTrigger.triggerData.isTriggered) {
      handleGetUser();
    }
  }, [eventUploadTrigger.triggerData]);

  const handleSignOut = async () => {
    await signOut();
    navigate("/auth/sign-in");
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
                alt={userAccount?.firstName}
                src={
                  process.env.REACT_APP_BUNNY_PULL_ZONE +
                  userAccount?.newName +
                  "-" +
                  userAccount?._id +
                  "/" +
                  process.env.REACT_APP_ZONE_PROFILE +
                  "/" +
                  userAccount?.profile
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
              alt={userAccount?.firstName}
              src={
                process.env.REACT_APP_BUNNY_PULL_ZONE +
                userAccount?.newName +
                "-" +
                userAccount?._id +
                "/" +
                process.env.REACT_APP_ZONE_PROFILE +
                "/" +
                userAccount?.profile
              }
            />
            <MUI.BoxShowCurrentUserDetail>
              <Typography variant="h6">
                {userAccount?.firstName + " " + userAccount?.lastName}
              </Typography>
              <Typography variant="h6">{userAccount?.email}</Typography>
            </MUI.BoxShowCurrentUserDetail>
          </MUI.BoxShowCurrentUser>
          <Divider sx={{ margin: "0.8rem 0" }} />
          <MUI.MenuItems
            onClick={() => {
              navigate("/account-setting", { state: 1 });
              closeMenu();
            }}
          >
            <ManageAccountsOutlinedIcon sx={{ fontSize: "20px" }} />
            &nbsp; Profile
          </MUI.MenuItems>
          <MUI.MenuItems
            onClick={() => {
              navigate("/account-setting", { state: 1 });
              closeMenu();
            }}
          >
            <SettingsOutlinedIcon sx={{ fontSize: "20px" }} />
            &nbsp; Setting
          </MUI.MenuItems>
          <Divider sx={{ margin: "0.8rem 0" }} />
          <MUI.MenuItems
            onClick={() => {
              navigate("/support-ticket");
              closeMenu();
            }}
          >
            <CameraOutlinedIcon sx={{ fontSize: "20px" }} />
            &nbsp; Help and support
          </MUI.MenuItems>
          <MUI.MenuItems
            onClick={() => {
              navigate("/faq");
              closeMenu();
            }}
          >
            <HelpOutlineOutlinedIcon sx={{ fontSize: "20px" }} />
            &nbsp; FAQ
          </MUI.MenuItems>
          <MUI.MenuItems
            onClick={() => {
              navigate("/pricing");
              closeMenu();
            }}
          >
            <AttachMoneyIcon sx={{ fontSize: "20px" }} />
            &nbsp; Pricing
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
