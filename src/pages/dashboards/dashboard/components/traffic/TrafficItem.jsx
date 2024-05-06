import { Box, Typography, useMediaQuery, useTheme } from "@mui/material";
import { styled } from "@mui/material/styles";
import { intToPrettyString, stringPluralize } from "../../../../../functions";
import * as Icon from "../../../../../icons/icons";

const TrafficItemContainer = styled("div")(({ theme, ...props }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  width: "100%",
}));

const TrafficItem = (props) => {
  const theme = useTheme();
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
      <Box sx={{ display: "flex", columnGap: 3, width: "100%" }}>
        <Typography
          component="div"
          sx={{
            fontSize: "2rem",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {props.icon}
        </Typography>
        <Typography
          component="div"
          sx={{
            display: "flex",
            flexGrow: 1,
            flexDirection: "column",
          }}
        >
          <Typography
            component="span"
            sx={{
              fontWeight: 600,
            }}
          >
            {intToPrettyString(props.amount)}{" "}
            {stringPluralize(props.amount, "user", "s")}
          </Typography>
          <Typography component="span" sx={{}}>
            {_.capitalize(props.name)}
          </Typography>
        </Typography>
        <Typography
          component="div"
          sx={{
            display: "flex",
            columnGap: 1,
            alignItems: "center",
          }}
        >
          {props.percent > 0 ? (
            <Typography
              component="div"
              sx={{
                display: "flex",
                alignItems: "center",
                color: "#29c770",
              }}
            >
              <Icon.IoIosArrowUpIcon />
            </Typography>
          ) : (
            <>
              {props.percent < 0 && (
                <Typography
                  component="div"
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    color: "rgb(234, 84, 85)",
                  }}
                >
                  <Icon.IoIosArrowDownIcon />
                </Typography>
              )}
            </>
          )}
          <Typography component="span" sx={{}}>
            {props.percent}%
          </Typography>
        </Typography>
      </Box>
    </TrafficItemContainer>
  );
};

export default TrafficItem;
