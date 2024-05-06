import * as React from "react";
import PropTypes from "prop-types";
import LinearProgress from "@mui/material/LinearProgress";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

function LinearProgressWithLabel(props) {
  return (
    <Box sx={{ display: "flex", alignItems: "center" }}>
      <Box sx={{ width: "100%", mr: 1 }}>
        <LinearProgress
          variant="determinate"
          {...props}
          sx={{
            border: "1px solid white",
            borderRadius: "10px",
            height: "10px",
          }}
        />
      </Box>
      <Box sx={{ minWidth: 35, color: "white" }}>
        <Typography variant="body2">{`${Math.round(props.value)}%`}</Typography>
      </Box>
    </Box>
  );
}

LinearProgressWithLabel.propTypes = {
  value: PropTypes.number.isRequired,
};

export default function LinearWithValueLabel(props) {
  return (
    <Box sx={{ width: "100%", top: 0, right: 0, color: "white" }}>
      <LinearProgressWithLabel value={props.percentage} />
    </Box>
  );
}
