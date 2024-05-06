import { Box, Tooltip, Typography, createTheme } from "@mui/material";
import fileLogo from "../../../utils/images/Logo_2.svg";

function ShowDropUpload() {
  const theme = createTheme();
  return (
    <Tooltip title="Double click for select more" placement="top" followCursor>
      <Box
        sx={{
          border: "2px dashed #5D9F97",
          borderRadius: "10px",
          padding: "0 0 1rem 0",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          cursor: "pointer",
        }}
      >
        <img src={fileLogo} alt="file icon" />
        <Typography
          variant="h3"
          sx={{
            margin: "0.2rem",
            fontSize: "1.125rem",
            [theme.breakpoints.down("sm")]: {
              fontSize: "0.9rem",
            },
          }}
        >
          Double click to&nbsp;
          <strong style={{ color: "#17766B" }}>select more</strong>
        </Typography>
        <Typography
          variant="h6"
          sx={{
            margin: "0.1rem",
            fontSize: "1rem",
            [theme.breakpoints.down("sm")]: {
              fontSize: "0.7rem",
            },
          }}
        >
          Max file size 50 MB
        </Typography>
      </Box>
    </Tooltip>
  );
}

export default ShowDropUpload;
