import React from "react";

//mui component and style
import { styled as muiStyled } from "@mui/system";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import { Card, CardContent, CardMedia, Typography } from "@mui/material";

//function

//icon
import { FileIcon, defaultStyles } from "react-file-icon";

const FileCardContainer = muiStyled("div")(({ theme }) => ({
  "> .MuiBox-root": {
    display: "flex",
    ".MuiPaper-root": {
      height: "100%",
    },
  },
}));

export default function FileCard({ btnProps, ...props }) {
  return (
    <FileCardContainer>
      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={3}>
          {props.children}
        </Grid>
      </Box>
    </FileCardContainer>
  );
}
