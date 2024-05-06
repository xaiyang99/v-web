import React from "react";

// material ui component
import Typography from "@mui/material/Typography";

// react animate component
import ProgressBar from "react-animated-progress-bar";

const byte = 1000000000;

const SidebarFooter = ({ ...rest }) => {
  const [percentage, setPercentage] = React.useState(0);
  const [purchaseArea, setPurchaseArea] = React.useState(100000000000);
  const [usedArea, setUsedArea] = React.useState(85000000000);
  React.useEffect(() => {
    setPercentage((usedArea * 100) / purchaseArea);
  }, []);
  return (
    <div
      sx={{
        width: 250,
        marginBottom: "2rem",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
      }}
    >
      <ProgressBar
        width="250"
        trackWidth="13"
        percentage={percentage + ""}
        defColor={{
          poor: "#2F998B",
          fair: "#2F998B",
          good: "#ECB317",
          excellent: "red",
        }}
      />
      <Typography variant="h4" sx={{ fontWeight: "800" }}>
        Storage Details
      </Typography>
      <Typography
        variant="h6"
        sx={{
          textAlign: "center",
          fontSize: "12px",
          fontWeight: "800",
          color: "gray",
          marginTop: "1rem",
        }}
      >
        {usedArea / byte} GB of {purchaseArea / byte} GB Used
      </Typography>
    </div>
  );
};

export default SidebarFooter;
