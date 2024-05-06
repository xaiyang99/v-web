import React from "react";
import { Outlet } from "react-router-dom";
import styled from "@emotion/styled";
import { CssBaseline } from "@mui/material";
import GlobalStyle from "../components/GlobalStyle";

const Root = styled.div`
  // max-width: 520px;
  max-width: auto;
  margin: 0 auto;
  justify-content: center;
  align-items: center;
  display: flex;
  min-height: 100%;
  height: 100%;
  flex-direction: column;
`;

const Auth = ({ children }) => {
  return (
    <Root>
      <CssBaseline />
      <GlobalStyle />
      {children}
      <Outlet />
    </Root>
  );
};

export default Auth;
