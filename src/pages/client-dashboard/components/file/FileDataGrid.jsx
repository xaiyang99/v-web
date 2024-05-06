import { Box } from "@mui/material";
import { styled } from "@mui/material/styles";
import { DataGrid } from "@mui/x-data-grid";
import { useEffect, useState } from "react";

//components
const FileDataGridContainer = styled("div")({
  width: "100%",
  height: "100%",

  ".MuiDataGrid-root": {
    /* backgroundColor: "white", */
    border: "none",
    /* borderBottom: "1px solid #A19EAA", */
    borderRadius: 0,
    ".MuiDataGrid-virtualScroller": {
      overflowX: "hidden",
    },
    ".MuiDataGrid-columnHeaders": {
      fontSize: "1rem",
    },
    ".MuiDataGrid-columnHeaders, .MuiDataGrid-cell": {
      /* borderBottom: "1px solid #A19EAA", */
    },
  },
});

export default function FileDataGrid({ dataGrid, ...props }) {
  const [data, setData] = useState([]);
  const [isLoaded, setIsLoaded] = useState(null);

  useEffect(() => {
    if (props.data?.length > 0) {
      // setData((_) =>
      setData(() =>
        props.data.map((data, index) => ({
          noId: index,
          ...data,
        })),
      );
      setIsLoaded(true);
    }
  }, [props.data]);

  return (
    <FileDataGridContainer>
      <Box sx={{ height: "100%", width: "100%" }}>
        {isLoaded && (
          <DataGrid
            autoHeight
            {...{
              ...dataGrid,
              sx: {
                "& .MuiDataGrid-cell:focus": {
                  outline: "none",
                },
                ...dataGrid.sx,
              },
              disableDensitySelector: true,
              rows: data,
              getRowId: (row) => row._id,
            }}
            sx={{
              height: "100% !important",
              borderRadius: 0,
              "& .MuiDataGrid-columnSeparator": { display: "none" },
              "& .MuiDataGrid-virtualScroller": {
                overflowX: "scroll",
              },
            }}
          />
        )}
      </Box>
    </FileDataGridContainer>
  );
}
