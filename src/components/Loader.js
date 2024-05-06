import React from "react";
import styled from "@emotion/styled";
import { CircularProgress } from "@mui/material";

const Root = styled.div`
  justify-content: center;
  align-items: center;
  display: flex;
  min-height: 100%;
`;

function Loader(props) {
  return (
    <Root>
      <CircularProgress
        size={props.size ? props.size : 25}
        color="primaryTheme"
      />
    </Root>
  );
}

export default Loader;
