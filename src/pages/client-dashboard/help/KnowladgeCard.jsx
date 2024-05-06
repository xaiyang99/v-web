import React from "react";
import * as MUI from "../css/helpStyle";
import { Typography } from "@mui/material";

function KnowladgeCard() {
  return (
    <MUI.BoxShowKnowledge>
      <MUI.BoxShowKnowledgeHeader>
        <Typography variant="h4">Logo</Typography>
        <Typography variant="h4">E-Commerce</Typography>
      </MUI.BoxShowKnowledgeHeader>
      <MUI.BoxShowKnowledgeBody>
        <ul>
          <li>Pricing Wizard</li>
          <li>Square Sync</li>
          <li>Checkout</li>
          <li>Offers</li>
        </ul>
      </MUI.BoxShowKnowledgeBody>
      <MUI.BoxShowKnowledgeFooter>
        <Typography variant="h5">56 articles</Typography>
      </MUI.BoxShowKnowledgeFooter>
    </MUI.BoxShowKnowledge>
  );
}

export default KnowladgeCard;
