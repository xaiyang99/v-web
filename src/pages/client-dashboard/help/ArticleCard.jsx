import React from "react";
import * as MUI from "../css/helpStyle";
import { Typography } from "@mui/material";

function ArticleCard() {
  return (
    <MUI.BoxShowCard>
      <img
        src="https://img.freepik.com/premium-vector/doodle-black-white-gift-box-outline-cartoon-package-with-present-bow-delivery-valentine_448971-460.jpg"
        alt=""
      />
      <Typography variant="h4">Getting Started</Typography>
      <Typography variant="h6">
        Whether you're new or you're a power user, this article will....
      </Typography>
      <MUI.ReadMoreButton>Read More</MUI.ReadMoreButton>
    </MUI.BoxShowCard>
  );
}

export default ArticleCard;
