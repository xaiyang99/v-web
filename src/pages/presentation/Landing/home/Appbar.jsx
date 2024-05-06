import * as React from "react";

// material ui components
import shareLogo from "../../../../utils/images/Logo_Vshare_all_white-11.svg";
import blackShareLogo from "../../../../utils/images/vshare-black-logo.png";
import "../css/style.css";

// material ui components
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import ListSubheader from "@mui/material/ListSubheader";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";

// material ui icons
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import { NavLink, useLocation } from "react-router-dom";
import { Typography } from "@mui/material";
import { accessTokenLocalKey } from "../../../../functions";

function ResponsiveAppBar() {
  const location = useLocation();
  const [state, setState] = React.useState({ right: false });
  const [token, setToken] = React.useState("");
  React.useEffect(() => {
    // const loggedInUser = localStorage.getItem("accessToken");
    const loggedInUser = localStorage.getItem(accessTokenLocalKey);
    if (loggedInUser) {
      const foundUser = loggedInUser;
      setToken(foundUser);
    }
  }, []);

  // responsive toggleDrawer
  const toggleDrawer = (anchor, open) => (event) => {
    if (
      event &&
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }
    setState({ ...state, [anchor]: open });
  };

  const list = (anchor) => (
    <Box
      sx={{ width: anchor === "top" || anchor === "bottom" ? "auto" : 250 }}
      role="presentation"
    >
      <List
        sx={{
          width: "100%",
          maxWidth: 360,
          bgcolor: "background.paper",
          marginTop: "1rem",
        }}
        component="nav"
        aria-labelledby="nested-list-subheader"
        subheader={
          <ListSubheader
            component={NavLink}
            to="/"
            id="nested-list-subheader"
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <img
              src={blackShareLogo}
              alt="share logo"
              width={120}
              height={30}
            />
            <IconButton onClick={toggleDrawer(anchor, false)}>
              <CloseIcon />
            </IconButton>
          </ListSubheader>
        }
      >
        <ListItemButton
          component={NavLink}
          to="/contact-us"
          selected={"/contact-us" === location.pathname}
          sx={{
            padding: "0.2rem 0 0.2rem 1rem",
            borderBottom: "1px solid #DBDBDB",
            width: "100%",
          }}
        >
          <span>Contact us</span>
        </ListItemButton>
        <ListItemButton
          component={NavLink}
          to="/filedrop-page"
          selected={"/filedrop-page" === location.pathname}
          sx={{
            padding: "0.2rem 0 0.2rem 1rem",
            borderBottom: "1px solid #DBDBDB",
            width: "100%",
          }}
        >
          <span>File drop</span>
        </ListItemButton>
        <ListItemButton
          component={NavLink}
          to="/feedback-page"
          selected={"/feedback-page" === location.pathname}
          sx={{
            padding: "0.2rem 0 0.2rem 1rem",
            borderBottom: "1px solid #DBDBDB",
            width: "100%",
          }}
        >
          <span>Feedback</span>
        </ListItemButton>
        {token == "" ? (
          <>
            <ListItemButton
              component={NavLink}
              to="/auth/sign-in"
              sx={{
                padding: "0.2rem 0 0.2rem 1rem",
                borderBottom: "1px solid #DBDBDB",
                width: "100%",
              }}
            >
              <span>Sign in</span>
            </ListItemButton>
            <ListItemButton
              component={NavLink}
              to="/auth/sign-up"
              sx={{
                padding: "0.2rem 0 0.2rem 1rem",
                borderBottom: "1px solid #DBDBDB",
                width: "100%",
              }}
            >
              <span>Sign up</span>
            </ListItemButton>
          </>
        ) : (
          <ListItemButton component={NavLink} to="/dashboard">
            <Typography
              variant="h6"
              sx={{
                padding: "0.2rem 0 0.2rem 0",
                borderBottom: "1px solid #DBDBDB",
                width: "100%",
              }}
            >
              Dashboard
            </Typography>
          </ListItemButton>
        )}
      </List>
    </Box>
  );

  const navActive = ({ isActive }) => {
    return {
      color: isActive ? "#ffffff" : "white",
      borderBottom: isActive ? "1px solid #ffffff" : "none",
      borderRadius: "0 !important",
    };
  };

  return (
    <AppBar className="appbar appbar-bg">
      <Container maxWidth="lg" className="container">
        <Toolbar disableGutters>
          <Box
            sx={{
              flexGrow: 2,
              display: { xs: "flex", md: "none" },
            }}
            component={NavLink}
            to="/"
          >
            <img src={shareLogo} alt="share logo" width={120} height={30} />
          </Box>
          <Box
            sx={{
              flexGrow: 1,
              display: { xs: "none", md: "flex" },
            }}
          >
            <Box component={NavLink} to="/">
              <img src={shareLogo} alt="share logo" width={200} height={50} />
            </Box>
          </Box>
          <Box
            sx={{
              flexGrow: 0,
              display: { xs: "none", md: "flex" },
            }}
          >
            <Tooltip title="File drop">
              <Button
                className="menuList"
                component={NavLink}
                to="/contact-us"
                style={navActive}
                sx={{ borderRadius: "0" }}
              >
                Contact us
              </Button>
            </Tooltip>
            <Tooltip title="File drop">
              <Button
                className="menuList"
                component={NavLink}
                to="/filedrop-page"
                style={navActive}
                sx={{ borderRadius: "0" }}
              >
                File drop
              </Button>
            </Tooltip>
            <Tooltip title="Leave feedback">
              <Button
                className="menuList"
                component={NavLink}
                to="/feedback-page"
                style={navActive}
                sx={{ borderRadius: "0" }}
              >
                Feedback
              </Button>
            </Tooltip>
            {token == "" ? (
              <>
                <Tooltip title="Sign in">
                  <Button
                    className="menuList"
                    component={NavLink}
                    to="/auth/sign-in"
                    style={navActive}
                    sx={{
                      border: "1px solid #ffffff",
                      borderBottom: "1px solid #ffffff !important",
                      "&:hover": {
                        border: "1px solid #ffffff",
                        borderBottom: "1px solid #ffffff !important",
                      },
                    }}
                  >
                    Sign in
                  </Button>
                </Tooltip>
                <Tooltip title="Get started">
                  <Button
                    className="menuList"
                    component={NavLink}
                    to="/auth/sign-up"
                    style={navActive}
                    sx={{
                      border: "1px solid #ffffff",
                      background: "#ffffff",
                      color: "#17766B !important",
                      fontWeight: "700 !important",
                      "&:hover": {
                        border: "1px solid #ffffff",
                        background: "#ffffff",
                        color: "#17766B",
                      },
                    }}
                  >
                    Get started
                  </Button>
                </Tooltip>
              </>
            ) : (
              <Tooltip title="Dashboard">
                <Button
                  className="menuList"
                  component={NavLink}
                  to="/dashboard"
                  style={navActive}
                  sx={{
                    border: "1px solid #ffffff",
                    background: "#ffffff",
                    color: "black",
                    "&:hover": {
                      border: "1px solid #ffffff",
                      background: "#ffffff",
                      color: "#17766B",
                    },
                  }}
                >
                  <Typography variant="h6" sx={{ color: "#17766B" }}>
                    Dashboard
                  </Typography>
                </Button>
              </Tooltip>
            )}
          </Box>
          <Box sx={{ flexGrow: 0, display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={toggleDrawer("right", true)}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </Container>
      <SwipeableDrawer
        anchor={"right"}
        open={state["right"]}
        onClose={toggleDrawer("right", false)}
        onOpen={toggleDrawer("right", true)}
      >
        {list("right")}
      </SwipeableDrawer>
    </AppBar>
  );
}

export default ResponsiveAppBar;
