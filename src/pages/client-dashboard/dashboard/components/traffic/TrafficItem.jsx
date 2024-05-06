import { Box, useMediaQuery } from "@mui/material";
import { styled } from "@mui/material/styles";

const TrafficItemContainer = styled("div")(({ theme, ...props }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  width: "100%",
}));

const TrafficItem = (props) => {
  const isMobile = useMediaQuery("(max-width:768px)");
  const CustomIcon = styled("div")(({ theme, ...props }) => ({
    display: "flex",
    alignItems: "center",
    width: isMobile ? "30px" : "40px",
    height: isMobile ? "30px" : "40px",
    fontSize: isMobile ? "18px" : "22px",
    borderRadius: "50%",
  }));
  return (
    <TrafficItemContainer>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
        }}
      >
        <CustomIcon>{props.icon}</CustomIcon>
        <Box
          sx={{
            typography: isMobile ? "p" : "h5",
            fontWeight: 600,
          }}
        >
          {props.name}
        </Box>
      </Box>
      <Box
        sx={{
          typography: isMobile ? "p" : "h5",
          color: (theme) => theme.palette.primary.main,
        }}
      >
        {props.percent}
      </Box>
    </TrafficItemContainer>
  );
};

export default TrafficItem;
