import AutorenewOutlinedIcon from "@mui/icons-material/AutorenewOutlined";
import ViewAgendaOutlinedIcon from "@mui/icons-material/ViewAgendaOutlined";
import {
  Box,
  Button,
  CircularProgress,
  Paper,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { alpha } from "@mui/system";
import { RiLineChartFill } from "react-icons/ri";
import { useDispatch, useSelector } from "react-redux";
import {
  selectOptionState,
  setRefresh,
  setResetRefresh,
  setToggle,
} from "../../../../redux/slices/statistics";
import monthName from "../tableStatistic/MonthName";

function HeadActionFormate(props) {
  const dispatch = useDispatch();
  const isMobile = useMediaQuery("(max-width:768px)");
  const selectedValue = useSelector(selectOptionState);

  const handlerefresh = async () => {
    if (!selectedValue.refreshing) {
      dispatch(setRefresh());
      await new Promise((resolve) => setTimeout(resolve, 200));
      dispatch(setResetRefresh());
    }
  };

  const handleToggle = () => {
    dispatch(setToggle());
  };

  const monthNames = monthName();
  const currentDate = new Date();
  const formattedDate = ` ${currentDate.getDate()} ${
    monthNames[currentDate.getMonth()]
  } ${currentDate.getFullYear()}`;
  const timePart = currentDate.toLocaleTimeString("en-US", {
    hour12: true,
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
  });
  return (
    <div>
      <Paper sx={{ mb: 2, boxShadow: "rgba(0, 0, 0, 0.09) 0px 1px 8px" }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: isMobile ? "flex-end" : "space-between",
            alignItems: "center",
            padding: "10px 20px",
          }}
        >
          {!isMobile && <Typography variant="h6">{props?.title}</Typography>}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 2,
            }}
          >
            <Typography variant="body" sx={{ marginRight: 3 }}>
              {`${formattedDate}, ${timePart}`}
            </Typography>
            <Button
              size="small"
              variant="contained"
              sx={{
                cursor: selectedValue.refreshing ? "wait" : "pointer",
                backgroundColor: (theme) =>
                  alpha(theme.palette.primary.main, 0.2),
                color: (theme) => alpha(theme.palette.primary.main, 1),
                "&:hover": {
                  backgroundColor: (theme) =>
                    alpha(theme.palette.primary.main, 0.4),
                },
              }}
              onClick={handlerefresh}
            >
              {selectedValue.refreshing && (
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <span>Loading...</span> &nbsp;
                  <CircularProgress
                    size={16}
                    sx={{
                      color: (theme) => theme.palette.primary.main,
                    }}
                  />
                </Box>
              )}
              {!selectedValue.refreshing && !isMobile && "Data Refresh"} &nbsp;
              {!selectedValue.refreshing && (
                <AutorenewOutlinedIcon sx={{ fontSize: 18 }} />
              )}
            </Button>
            <Button
              sx={{
                minWidth: "20px",
                padding: "5px",
                backgroundColor: (theme) =>
                  alpha(theme.palette.primary.main, 0.2),
                color: (theme) => alpha(theme.palette.primary.main, 1),
                "&:hover": {
                  backgroundColor: (theme) =>
                    alpha(theme.palette.primary.main, 0.4),
                },
              }}
              variant="contained"
              onClick={handleToggle}
            >
              {selectedValue.toggle === "list" ? (
                <ViewAgendaOutlinedIcon sx={{ fontSize: 18 }} />
              ) : (
                <RiLineChartFill size={18} />
              )}
            </Button>
          </Box>
        </Box>
      </Paper>
    </div>
  );
}

export default HeadActionFormate;
