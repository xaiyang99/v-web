import React, { useEffect } from "react";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import { Card, CardContent, CardMedia, Typography } from "@mui/material";
import useAuth from "../../../hooks/useAuth";
import ReactAudioPlayer from "react-audio-player";
import { FileIcon, defaultStyles } from "react-file-icon";
import {
  GetFileType,
  formatIndochinaDate,
  formatMomentDate,
} from "../../../functions";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: "#F3F3F3",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "left",
  color: theme.palette.text.secondary,
  position: "relative",
  minHeight: "150px",
  display: "flex",
  justifyContent: "center",
  marginBottom: "10px",
}));
const TitleFile = styled(Box)(({ theme }) => ({
  position: "absolute",
  left: "25%",
  top: "75%",
  color: "black",
  background: "#fff",
  padding: "2px 8px",
  borderRadius: "10px",
  fontSize: "12px",
}));
export default function FileCard(props) {
  const { user } = useAuth();

  const url_image = "https://sg.storage.bunnycdn.com/vshare/";

  return (
    <div>
      <Box sx={{ flexGrow: 1, pt: 2 }}>
        <Grid container spacing={3}>
          {props.data.map((item, index) => {
            let type = item?.fileType.slice(0, item?.fileType.indexOf("/"));

            let newName = item?.newFilename;
            if (type == "image") {
              return (
                <Grid item xs={6} md={2}>
                  <Item>
                    <CardMedia
                      sx={{ height: 140, objectFit: "contain" }}
                      image={url_image + "/" + user?.username + "/" + newName}
                      title="green iguana"
                    />

                    <TitleFile key={index}>
                      {item?.filename.length < 15
                        ? item?.filename
                        : item?.filename.slice(0, 15) + "..."}
                    </TitleFile>
                  </Item>
                </Grid>
              );
            } else {
              return (
                <Grid item xs={6} md={2}>
                  <Item>
                    <Box
                      sx={{
                        maxWidth: "50px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        mb: 2,
                      }}
                    >
                      <FileIcon
                        extension={GetFileType(item?.filename)}
                        {...defaultStyles[GetFileType(item?.filename)]}
                      />
                    </Box>

                    <TitleFile key={index}>
                      {item?.filename.length < 15
                        ? item?.filename
                        : item?.filename.slice(0, 15) + "..."}
                    </TitleFile>
                  </Item>
                </Grid>
              );
            }
          })}
        </Grid>
      </Box>
    </div>
  );
}
