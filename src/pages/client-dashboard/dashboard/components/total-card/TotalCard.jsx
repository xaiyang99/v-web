import { Box, Grid, Tooltip, useMediaQuery } from "@mui/material";
import { styled } from "@mui/material/styles";
import React from "react";

const TotalCardContainer = styled("div")(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#fff" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(6),
  textAlign: "left",
  color: theme.palette.text.secondary,
  borderRadius: "8px",
  boxShadow: "rgba(0, 0, 0, 0.09) 0px 3px 12px",
  whiteSpace: "nowrap",
}));

const TotalCardContent = styled("div")(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  columnGap: "5px",
  marginBottom: theme.spacing(5),
}));
const TotalMobileCardContent = styled("div")(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  columnGap: "2px",
  marginBottom: theme.spacing(0),
}));
const TotalCardLeft = styled("div")(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  rowGap: theme.spacing(2),
}));
const TotalCardMobieLef = styled("div")(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  rowGap: theme.spacing(2),
  overflowX: "hidden",
}));
const TotalCardRight = styled("div")({});

const TotalCardIcon = styled("div")({
  padding: "8px 9px",
  width: "40px",
  height: "40px",
  fontSize: "22px",
  borderRadius: "50%",
});
const TotalCardMinMobieIcon = styled("div")({
  padding: "5px 7px",
  width: "30px",
  height: "30px",
  fontSize: "18px",
  borderRadius: "50%",
});
const TotalCard = (props) => {
  const isMobile = useMediaQuery("(max-width:768px)");
  const isMiniMobile = useMediaQuery("(max-width:350px)");
  const totalCardRef = React.useRef(null);
  const [totalCardWidth, setTotalCardWidth] = React.useState(0);

  React.useEffect(() => {
    const element = totalCardRef.current;

    if (!element) return;

    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        const computedStyle = window.getComputedStyle(element);
        const totalWidth = parseFloat(computedStyle.width);
        /* +parseFloat(computedStyle.paddingLeft) +
          parseFloat(computedStyle.paddingRight); */
        setTotalCardWidth(totalWidth);
      }
    });

    resizeObserver.observe(element);

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  return (
    <TotalCardContainer
      ref={totalCardRef}
      sx={{
        ...(isMobile && {
          borderRadius: 0,
          boxShadow: 0,
          backgroundColor: "transparent",
          padding: 0,
        }),
      }}
    >
      {isMobile ? (
        <TotalMobileCardContent className="total-card-content">
          <Grid container>
            <Grid item xs={4} sm={4} md={2} lg={2}>
              <TotalCardLeft>
                {isMiniMobile ? (
                  <TotalCardMinMobieIcon
                    sx={{
                      ...props.icon.style,
                    }}
                  >
                    {props.icon.element}
                  </TotalCardMinMobieIcon>
                ) : (
                  <TotalCardIcon
                    sx={{
                      ...props.icon.style,
                    }}
                  >
                    {props.icon.element}
                  </TotalCardIcon>
                )}
              </TotalCardLeft>
            </Grid>
            <Grid item xs={8} sm={8} md={10} lg={10}>
              <TotalCardMobieLef>
                <Box
                  sx={{
                    fontWeight: "bold",
                    typography: isMobile ? "p" : "h3",
                  }}
                >
                  <Tooltip title={props.total}>
                    <span>{props.total}</span>
                  </Tooltip>
                </Box>
                <Box
                  sx={{
                    typography: "p",
                    textTransform: "capitalize",
                    fontSize: isMobile ? "0.7rem" : "0.9rem",
                    fontWeight: 500,
                  }}
                >
                  {props.title}
                </Box>
              </TotalCardMobieLef>
            </Grid>
          </Grid>
        </TotalMobileCardContent>
      ) : (
        <TotalCardContent className="total-card-content">
          <Grid container>
            <Grid item xs={10} sm={10} md={10} lg={10}>
              <TotalCardLeft>
                <Box
                  sx={{
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    typography: isMobile ? "h6" : "h3",
                  }}
                >
                  {/*  {totalCardWidth <= 230 && props.total?.length > 7 ? (
                    <Tooltip title={props.total}>
                      <span>{cutStringWithEllipsis(props.total, 7, 7)}</span>
                    </Tooltip>
                  ) : (
                    <>{props.total}</>
                  )} */}
                  <Tooltip title={props.total}>
                    <span>{props.total}</span>
                  </Tooltip>
                </Box>
                <Box
                  sx={{
                    typography: "p",
                    textTransform: "capitalize",
                    fontSize: "0.9rem",
                    fontWeight: 500,
                  }}
                >
                  {props.title}
                </Box>
              </TotalCardLeft>
            </Grid>
            <Grid item xs={2} sm={2} md={2} lg={2}>
              <TotalCardRight>
                <TotalCardIcon
                  sx={{
                    ...props.icon.style,
                  }}
                >
                  {props.icon.element}
                </TotalCardIcon>
              </TotalCardRight>
            </Grid>
          </Grid>
        </TotalCardContent>
      )}
    </TotalCardContainer>
  );
};

export default TotalCard;
