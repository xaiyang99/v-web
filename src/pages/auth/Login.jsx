import React from "react";
import "react-multi-carousel/lib/styles.css";

// components
import LoginComponent from "../../components/auth/Login";
import vShareLogo from "../../utils/images/sabaiydev-logo.png";
import * as MUI from "./css/style";
import "./css/style.css";

// material ui icons and components
import { Box, Typography } from "@mui/material";
import { NavLink } from "react-router-dom";

function SignIn() {
  return (
    <React.Fragment>
      <MUI.BoxShowLoginLayout>
        <MUI.BoxShowLoginInside>
          <MUI.BoxRectangleTop></MUI.BoxRectangleTop>
          <MUI.BoxRectangleTop1></MUI.BoxRectangleTop1>
          <MUI.LoginContainer maxWidth="sm">
            <Box
              sx={{
                cursor: "pointer",
              }}
              component={NavLink}
              to="/"
            >
              <img
                src={vShareLogo}
                alt="v-share logo"
                width={250}
                height={100}
              />
            </Box>
            <Box
              sx={{
                display: "flex",
                alignItems: "start",
                justifyContent: "start",
                flexDirection: "column",
                width: "100%",
                margin: "0 0 1rem 0",
              }}
            >
              <Typography variant="h3">Welcome to Vshare</Typography>
              <Typography variant="h6">
                Please sign in to your account and start the adventure
              </Typography>
            </Box>
            <LoginComponent />
          </MUI.LoginContainer>
          <MUI.BoxRectangleBottom>
            <MUI.BoxRectangleBottomInside />
          </MUI.BoxRectangleBottom>
        </MUI.BoxShowLoginInside>
      </MUI.BoxShowLoginLayout>
    </React.Fragment>
  );
}

export default SignIn;
