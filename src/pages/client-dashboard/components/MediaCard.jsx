import { Fragment } from "react";

import {
  Button,
  Card,
  CardActions,
  CardContent,
  Typography,
} from "@mui/material";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import { styled } from "@mui/material/styles";

// components
import { Base64 } from "js-base64";
import { useNavigate } from "react-router-dom";
import { ConvertBytetoMBandGB } from "../../../functions";
import useAuth from "../../../hooks/useAuth";
import * as MUI from "../css/componentStyle";
import cardNumber from "./slider/CardHeadNumber";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(0),
  textAlign: "left",
  color: theme.palette.text.secondary,
  boxShadow: "rgba(0, 0, 0, 0.09) 0px 3px 12px",
}));

const FileTypeTitle = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  fontSize: "1.1rem",
  marginTop: "5px",
}));

function MediaCard(props) {
  const { getCount, countLoading } = props;
  const navigate = useNavigate();
  const { user } = useAuth();
  const handleClick = (val) => {
    const status = Base64.encode("active", true);
    const value = Base64.encode(val, true);
    const userId = Base64.encode(user?._id, true);
    navigate(`/file/${userId}/${value}/${status}`);
    if (!val) {
      navigate(`/myfile/file/${userId}/${value}/${status}`);
    }
  };
  let application = 0;
  let image = 0;
  let video = 0;
  let audio = 0;
  let text = 0;
  let other = 0;
  for (let i = 0; i < getCount?.getFileCategories?.data?.length; i++) {
    if (getCount?.getFileCategories?.data[i]?.fileType === "application") {
      application = getCount?.getFileCategories?.data[i]?.size;
    } else if (getCount?.getFileCategories?.data[i]?.fileType === "image") {
      image = getCount?.getFileCategories?.data[i]?.size;
    } else if (getCount?.getFileCategories?.data[i]?.fileType === "video") {
      video = getCount?.getFileCategories?.data[i]?.size;
    } else if (getCount?.getFileCategories?.data[i]?.fileType === "audio") {
      audio = getCount?.getFileCategories?.data[i]?.size;
    } else if (getCount?.getFileCategories?.data[i]?.fileType === "text") {
      text = getCount?.getFileCategories?.data[i]?.size;
    } else if (getCount?.getFileCategories?.data[i]?.fileType === "" || null) {
      other = getCount?.getFileCategories?.data[i]?.size;
    }
  }

  return (
    <Box>
      <Grid container rowSpacing={2} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
        {cardNumber.map((card, index) => (
          <Fragment key={index}>
            <Grid item md={2} xs={6} sm={6}>
              <Item>
                <Card>
                  <CardContent
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <Box>
                      <MUI.MyclouldIcon>{card.icon}</MUI.MyclouldIcon>
                      <FileTypeTitle variant="h4" sx={{ mb: 3 }}>
                        {card.title}
                      </FileTypeTitle>
                      <Typography variant="p" style={{ fontSize: "1rem" }}>
                        {card.type === "audio"
                          ? countLoading
                            ? "Loading.."
                            : ConvertBytetoMBandGB(audio)
                          : ""}
                        {card.type === "video"
                          ? countLoading
                            ? "Loading.."
                            : ConvertBytetoMBandGB(video)
                          : ""}
                        {card.type === "image"
                          ? countLoading
                            ? "Loading.."
                            : ConvertBytetoMBandGB(image)
                          : ""}
                        {card.type === "application"
                          ? countLoading
                            ? "Loading.."
                            : ConvertBytetoMBandGB(application)
                          : ""}
                        {card.type === "other"
                          ? countLoading
                            ? "Loading.."
                            : ConvertBytetoMBandGB(other)
                          : ""}
                        {card.type === "text"
                          ? countLoading
                            ? "Loading.."
                            : ConvertBytetoMBandGB(parseInt(text))
                          : ""}
                      </Typography>
                    </Box>
                  </CardContent>
                  <CardActions
                    sx={{
                      display: "flex",
                      justifyContent: "flex-end",
                      mt: -3,
                    }}
                  >
                    <Button onClick={() => handleClick(card.type)}>
                      View All
                    </Button>
                  </CardActions>
                </Card>
              </Item>
            </Grid>
          </Fragment>
        ))}
      </Grid>
    </Box>
  );
}

export default MediaCard;
