import "./../components/css/pagination.css";
import { Box } from "@mui/material";
import ResponsivePagination from "react-responsive-pagination";

const PaginationCirlce = (props) => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "flex-end",
        width: "90%",
        mt: 3,
      }}
    >
      <ResponsivePagination
        current={props.current}
        total={props.countPage}
        onPageChange={props.onPageChange}
      />
    </Box>
  );
};

export default PaginationCirlce;
