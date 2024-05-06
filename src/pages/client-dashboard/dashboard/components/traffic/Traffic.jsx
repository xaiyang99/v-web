import { Box, Grid, MenuItem, Paper, Select, Typography } from "@mui/material";
import { styled, createTheme } from "@mui/material/styles";

const TrafficContainer = styled("div")(({ theme, ...props }) => ({
  display: "flex",
  flexDirection: "column",
  backgroundColor: theme.palette.mode === "dark" ? "#fff" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(6),
  textAlign: "left",
  color: theme.palette.text.secondary,
  borderRadius: "8px",
  boxShadow: "rgba(0, 0, 0, 0.09) 0px 3px 12px",
  rowGap: theme.spacing(4),
  height: "100%",
}));

const Traffic = (props) => {
  return (
    <TrafficContainer>
      <Box
        sx={{
          typography: "h4",
          fontWeight: 600,
        }}
      >
        Traffics
      </Box>
      <Box
        sx={{
          borderBottom: "2px dotted rgba(0, 0, 0, 0.6)",
          width: "80px",
        }}
      />
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          rowGap: (theme) => theme.spacing(2),
          justifyContent: "space-between",
        }}
      >
        {props.children}
      </Box>
    </TrafficContainer>
  );
};

export default Traffic;
