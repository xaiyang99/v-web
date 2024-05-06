import { Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import React from "react";

//components
const EmptyContainer = styled("div")({
  flexGrow: 1,
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  height: "95%",
});

const EmptyContent = styled("div")({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  rowGap: "10px",
});

const EmptyIcon = styled("div")({
  fontSize: "10rem",
  color: "#ADD1CD",
  display: "flex",
  "& > svg": {
    width: "150px"
  }
});

const EmptyMessage = styled("div")(({ theme }) => {
  return {
    padding: 5,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    rowGap: "10px",
    fontSize: "1rem",
    "> .header": {
      fontWeight: 500,
      fontSize: "1.2rem",
    },
    "> .footer": {
      color: theme.palette.primary.main,
    },
  };
});

const IconEmpty = (props) => {
  return <>{props.icon}</>;
};

export default function Empty(props) {
  return (
    <EmptyContainer>
      <EmptyContent>
        <EmptyIcon>
          <IconEmpty icon={props.icon} />
        </EmptyIcon>
        <EmptyMessage>
          <Typography
            component="div"
            className="header"
            sx={{
              textAlign: "center",
            }}
          >
            {props.title}
          </Typography>
          <Typography
            component="div"
            className="body"
            sx={{
              textAlign: "center",
            }}
          >
            {props.context}
          </Typography>
        </EmptyMessage>
      </EmptyContent>
    </EmptyContainer>
  );
}
