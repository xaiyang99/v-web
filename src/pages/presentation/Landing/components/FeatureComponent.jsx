import * as React from "react";
import * as MUI from "../css/style";
import he from "he";

// component
import { limitContent } from "../../../../utils/limitTextLenght";

// material ui icon and component
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { createTheme, useMediaQuery } from "@mui/material";

export default function FeatureComponent(props) {
  const { title, content, image } = props;
  const theme = createTheme();
  const isMobile = useMediaQuery("(max-width: 600px)");
  const previewImage = process.env.REACT_APP_BUNNY_PREVIEW_IMAGE;
  return (
    <MUI.CardFeature sx={{ minWidth: 70 }}>
      <MUI.CardContentFeature sx={{ height: isMobile ? "14rem" : "auto" }}>
        <MUI.BoxFeatureCompIcon>
          <img src={image ? previewImage + image : ""} alt="" />
        </MUI.BoxFeatureCompIcon>
        <Box>
          <Typography
            variant=""
            sx={{
              marginTop: "0.5rem",
              fontSize: "1.125rem",
              fontWeight: 600,
              [theme.breakpoints.down("sm")]: {
                fontSize: "0.9rem",
                fontWeight: 500,
              },
            }}
          >
            {he.decode(limitContent(title, 30))}
          </Typography>
          <br />
          <Box
            sx={{
              textAlign: "start",
              marginTop: "0.5rem",
              width: "100%",
              textAlign: "justify",
              textJustify: "distribute",
              hyphens: "auto",
              textAlignLast: "left",
              fontWeight: 400,
              fontSize: "0.9rem",
              lineHeight: 1.25,
              [theme.breakpoints.down("sm")]: {
                fontWeight: 400,
                fontSize: "0.8rem",
                wordSpacing: "-3px",
                textAlign: "justify",
                textJustify: "distribute",
                hyphens: "auto",
                textAlignLast: "left",
              },
            }}
          >
            <Typography variant="">
              {he.decode(limitContent(content, 120))}
            </Typography>
          </Box>
        </Box>
      </MUI.CardContentFeature>
    </MUI.CardFeature>
  );
}
