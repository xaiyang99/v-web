import styled from "@emotion/styled/macro";
import { Box } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

//components
const TableFormatLayout = styled.div(() => ({
  width: "100%",
  height: "100%",

  ".MuiDataGrid-root": {
    backgroundColor: "white",
  },
}));

export default function TableFormat({ dataGrid, ...props }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [isFound, setIsFound] = useState(null);

  useEffect(() => {
    if (props.data.length > 0) {
      setData((_) =>
        props.data.map((data, index) => ({
          noId: index,
          ...data,
        }))
      );
    }
  }, [props.data]);
  return (
    <>
      <TableFormatLayout>
        <Box sx={{ height: "100%", width: "100%" }}>
          <DataGrid
            {...{
              getRowId: (row) => row._id,
              ...dataGrid,
              rows: data,
            }}
          />
        </Box>
      </TableFormatLayout>
    </>
  );
}
