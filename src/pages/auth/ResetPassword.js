import React from "react";
import styled from "@emotion/styled";

import { Paper, Typography } from "@mui/material";
import { FaLock } from "react-icons/fa";
import ResetPasswordComponent from "../../components/auth/ResetPassword";
import IconLogo from "./../../utils/images/Logo_Vshare_svg.svg";
import { useParams } from "react-router-dom";

const Wrapper = styled(Paper)`
  padding: ${(props) => props.theme.spacing(6)};

  ${(props) => props.theme.breakpoints.up("md")} {
    padding: ${(props) => props.theme.spacing(10)};
  }
  ${(props) => props.theme.breakpoints.down("sm")} {
    padding: ${(props) => props.theme.spacing(4)};
    margin: ${(props) => props.theme.spacing(4)};
  }
  box-shadow: rgba(149, 157, 165, 0.2) 0px 8px 24px;
`;
//components
const LogoBrand = styled("div")({
  display: "flex",
  justifyContent: "center",
  marginBottom: "2rem",
});

function ResetPassword() {
  const params = useParams();

  return (
    <React.Fragment>
      <Wrapper>
        <LogoBrand>
          <img src={IconLogo} alt="logo" width="130px" />
        </LogoBrand>

        <Typography component="h1" variant="h4" align="left" gutterBottom>
          Reset Password <FaLock fill="#9e9d24" size="16" />
        </Typography>

        <ResetPasswordComponent token={params?.token} />
      </Wrapper>
    </React.Fragment>
  );
}

export default ResetPassword;
