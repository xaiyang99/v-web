import React from "react";

//mui component and style
import { styled as muiStyled } from "@mui/system";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import { Card, CardContent, CardMedia, Typography } from "@mui/material";

//function
import { GetFileType } from "../../../functions";

//icon
import { FileIcon, defaultStyles } from "react-file-icon";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#F3F3F3",
  ...theme.typography.body2,
  textAlign: "left",
  color: theme.palette.text.secondary,
  position: "relative",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  minHeight: "150px",
}));

const FileIconContainer = muiStyled("div")(({ theme }) => ({
  width: "50px",
  height: "60px",
  borderRadius: "4px",
  padding: theme.spacing(1),
  /* backgroundColor: "#17766B", */
  display: "flex",
  alignItems: "center",
}));

const ItemTitle = muiStyled("div")(({ theme }) => ({
  maxWidth: "100%",
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
  position: "absolute",
  background: "white",
  padding: "2px 8px",
  borderRadius: "10px",
  fontSize: "12px",
  bottom: "5px",
  left: "50%",
  transform: "translate(-50%,-50%)",
}));

const ExtendFolderCardContainer = muiStyled("div")(({ theme }) => ({
  "> .MuiBox-root": {
    display: "flex",
    ".btn-extend-folder-item": {
      transition: "2s ease-in-out",
      ":after": {
        position: "absolute",
        content: "''",
        display: "block",
        width: "100%",
        height: "100%",
        borderRadius: "inherit",
        border: "1px solid #17766B",
        opacity: 0,
      },
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      border: 0,
      backgroundColor: "unset",
      cursor: "pointer",
      width: "100%",
      height: "100%",
      borderRadius: "4px",
      ":hover": {
        ":after": {
          opacity: 1,
        },
      },
    },
    ".MuiPaper-root": {
      height: "100%",
    },
  },
}));

export default function ExtendFolderCard({ btnProps, ...props }) {
  return (
    <ExtendFolderCardContainer>
      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={3}>
          {props?.data?.map((item, index) => (
            <Grid item xs={6} md={2} key={index}>
              <Item>
                <button
                  className="btn-extend-folder-item"
                  {...{
                    ...btnProps,
                    onDoubleClick: () => btnProps.onDoubleClick(item),
                  }}
                >
                  <FileIconContainer>
                    <FileIcon
                      color="white"
                      extension={GetFileType(item.name)}
                      {...{ ...defaultStyles[GetFileType(item.name)] }}
                    />
                  </FileIconContainer>
                  <ItemTitle>{item.name}</ItemTitle>
                </button>
              </Item>
            </Grid>
          ))}
        </Grid>
      </Box>
    </ExtendFolderCardContainer>
  );
}
