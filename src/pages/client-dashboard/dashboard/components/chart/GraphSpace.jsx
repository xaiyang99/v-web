import { Box, Grid, MenuItem, Tooltip, useMediaQuery } from "@mui/material";
import { createTheme, styled } from "@mui/material/styles";
import _ from "lodash";
import SelectStyled from "../../../../../components/SelectStyled";
import { cutStringWithEllipsis } from "../../../../../functions";
import BarChart from "./BarChart";
// import SelectStyled from "../SelectStyled";

const theme = createTheme();

const GraphSpaceContainer = styled("div")(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  backgroundColor: theme.palette.mode === "dark" ? "#fff" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(6),
  textAlign: "left",
  color: theme.palette.text.secondary,
  borderRadius: "8px",
  boxShadow: "rgba(0, 0, 0, 0.09) 0px 3px 12px",
  rowGap: theme.spacing(2.5),
  height: "100%",
}));

const GraphSpaceItem = styled("div")({
  flexGrow: 1,
});

const GraphSpace = (props) => {
  const isMobile = useMediaQuery("(max-width:768px)");
  const isMiniMobile = useMediaQuery("(max-width:350px)");
  return (
    <GraphSpaceContainer>
      <GraphSpaceItem>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            rowGap: theme.spacing(0.5),
          }}
        >
          <Box
            component="div"
            sx={{
              typography: isMobile ? "h6" : "h4",
              fontWeight: 600,
            }}
          >
            Space usage statistics
          </Box>
          <Box
            component="div"
            sx={{
              ...(isMobile && {
                fontSize: "0.7rem",
              }),
            }}
          >
            {_.capitalize(props.select.value)} Earnings Overview
          </Box>
        </Box>
      </GraphSpaceItem>
      <GraphSpaceItem>
        <Grid
          container
          sx={{
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <Grid
            item
            sx={{
              display: "flex",
              alignItems: "center",
              columnGap: theme.spacing(1),
            }}
          >
            <Box
              sx={{
                typography: isMobile ? "p" : "h3",
                fontWeight: 600,
                whiteSpace: "nowrap",
              }}
            >
              {isMiniMobile && props.totalSpace?.length > 7 ? (
                <Tooltip title={props?.totalSpace}>
                  <span>
                    {props.totalSpace
                      ? cutStringWithEllipsis(props.totalSpace, 7, 5)
                      : null}
                  </span>
                </Tooltip>
              ) : (
                <>{props.totalSpace}</>
              )}
            </Box>
            <Box
              sx={{
                color: (theme) => theme.palette.primary.main,
                ...(isMobile && {
                  fontSize: "0.7rem",
                }),
                fontWeight: 600,
                backgroundColor: "rgba(23,118,107,0.25)",
                padding: `${theme.spacing(0.5)} ${theme.spacing(1.25)}`,
                borderRadius: "4px",
              }}
            >
              User:{props.packageName}
            </Box>
          </Grid>
          <Grid item>
            <SelectStyled
              SelectDisplayProps={{
                sx: {
                  overflow: "unset !important",
                },
              }}
              value={props.select.value}
              variant="outlined"
              onChange={(e) => {
                props.select?.onChange?.(e.target.value);
              }}
              sx={{
                overflow: "unset",
              }}
            >
              <MenuItem
                value={"weekly"}
                sx={{
                  ...(isMobile && {
                    minHeight: "20px",
                    fontSize: "0.7rem",
                  }),
                }}
              >
                Weekly
              </MenuItem>
              <MenuItem
                value={"monthly"}
                sx={{
                  ...(isMobile && {
                    minHeight: "20px",
                    fontSize: "0.7rem",
                  }),
                }}
              >
                Monthly
              </MenuItem>
              <MenuItem
                value={"yearly"}
                sx={{
                  ...(isMobile && {
                    minHeight: "20px",
                    fontSize: "0.7rem",
                  }),
                }}
              >
                Yearly
              </MenuItem>
            </SelectStyled>
          </Grid>
        </Grid>
      </GraphSpaceItem>
      <GraphSpaceItem>
        {props.usedSpace && (
          <Box
            sx={{
              ...(isMobile && {
                fontSize: "0.7rem",
              }),
            }}
          >
            Used {props.usedSpace || null}
          </Box>
        )}
      </GraphSpaceItem>
      <GraphSpaceItem
        sx={{
          height: "300px",
        }}
      >
        <BarChart labels={props.labels} data={props.data} />
      </GraphSpaceItem>
    </GraphSpaceContainer>
  );
};
export default GraphSpace;
