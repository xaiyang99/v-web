import { Box, useMediaQuery } from "@mui/material";
import { styled } from "@mui/material/styles";

const StatisticsFileTypeContainer = styled("div")(({ theme }) => ({
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

const StatisticsFileType = (props) => {
  const isMobile = useMediaQuery("(max-width:768px)");
  return (
    <StatisticsFileTypeContainer>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <Box
          sx={{
            typography: isMobile ? "p" : "h4",
            fontWeight: 600,
          }}
        >
          Statistics on File Types
        </Box>
      </Box>
      <Box>{props.children}</Box>
    </StatisticsFileTypeContainer>
  );
};

export default StatisticsFileType;
