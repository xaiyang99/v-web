import { Box, Tooltip, useMediaQuery } from "@mui/material";
import { styled } from "@mui/material/styles";
import React from "react";

const StatisticsFileTypeItemContainer = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  rowGap: theme.spacing(2),
  columnGap: theme.spacing(2.5),
}));

const StatisticsFileTypeIcon = styled("div")({
  padding: "8px 9px",
  width: "40px",
  height: "40px",
  fontSize: "22px",
  borderRadius: "50%",
});

const StatisticsFileTypeItem = (props) => {
  const isMobile = useMediaQuery("(max-width:768px)");
  const statisticsFileTypeItemRef = React.useRef(null);
  const [statisticsFileTypeItemWidth, setStatisticsFileTypeItemWidth] =
    React.useState(0);

  React.useEffect(() => {
    const element = statisticsFileTypeItemRef.current;

    if (!element) return;

    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        const computedStyle = window.getComputedStyle(element);
        const totalWidth = parseFloat(computedStyle.width); /*  +
          parseFloat(computedStyle.paddingLeft) +
          parseFloat(computedStyle.paddingRight); */
        setStatisticsFileTypeItemWidth(totalWidth);
      }
    });

    resizeObserver.observe(element);

    return () => {
      resizeObserver.disconnect();
    };
  }, []);
  return (
    <StatisticsFileTypeItemContainer ref={statisticsFileTypeItemRef}>
      {!isMobile && (
        <Box
          sx={{
            width: "40px",
            minWidth: "40px",
            height: "40px",
            minHeight: "40px",
          }}
        >
          {/* <StatisticsFileTypeIcon
            sx={{
              ...props.icon?.style,
            }}
          >
        </StatisticsFileTypeIcon> */}
          {props.icon?.element}
        </Box>
      )}

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          overflowX: "hidden",
          columnGap: (theme) => theme.spacing(2),
          rowGap: (theme) => theme.spacing(1.5),
        }}
      >
        <Box
          sx={{
            typography: "p",
            columnGap: "4px",
            fontSize: isMobile ? "0.7rem" : "1rem",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {isMobile && (
            <Box>
              <StatisticsFileTypeIcon>
                {React.cloneElement(props.icon?.element, {
                  width: "100%",
                  height: "100%",
                })}
              </StatisticsFileTypeIcon>
            </Box>
          )}
          <Tooltip title={props.title}>
            <span>{props.title}</span>
          </Tooltip>
        </Box>
        <Box
          sx={{
            fontWeight: "bold",
            typography: isMobile ? "p" : "h3",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {/* {statisticsFileTypeItemWidth <= 90 && props.total?.length > 5 ? (
            <Tooltip title={props.total}>
              <span>{cutStringWithEllipsis(props.total, 6, 10)}</span>
            </Tooltip>
          ) : (
            <>{props.total}</>
          )} */}
          <Tooltip title={props.total}>
            <span>{props.total}</span>
          </Tooltip>
        </Box>
      </Box>
    </StatisticsFileTypeItemContainer>
  );
};

export default StatisticsFileTypeItem;
