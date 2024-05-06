import React from "react";
import * as MUI from "../css/boxCard";

function BoxCard(props) {
  return (
    <MUI.CardMedia sx={props.card_style ? props.card_style : ""}>
      <MUI.CardMediaContent>
        <div style={props.icon_style}>{props.icon}</div>
        <h3 style={props.typography_style} color="text.secondary" gutterBottom>
          {props.topic} <span>({props.amount})</span>
        </h3>
      </MUI.CardMediaContent>
    </MUI.CardMedia>
  );
}

export default BoxCard;
