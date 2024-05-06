import { DataGrid } from "@mui/x-data-grid";
import { useEffect, useState } from "react";

export default function DataGridFile({ dataGrid, ...props }) {
  const [data, setData] = useState([]);
  const { setHover, open, hanleOpenFile } = props;

  useEffect(() => {
    if (props?.data?.length > 0) {
      setData(() =>
        props.data.map((data, index) => ({
          noId: index,
          ...data,
        })),
      );
    }
  }, [props.data, dataGrid]);

  const handlePopperOpen = (event) => {
    const id = event.currentTarget.dataset.id;
    const row = props.data.find((r) => {
      return r.id === id;
    });

    setHover(row);
  };

  const handlePopperClose = () => {
    if (open == null) {
      return;
    }
    setHover("");
  };

  return (
    <DataGrid
      autoHeight
      {...{
        ...dataGrid,
        rows: data,
        getRowId: (row) => row?._id,
      }}
      key={(row) => row._id}
      checked={true}
      disableColumnFilter
      disableColumnMenu
      rowsPerPageOptions={[]}
      componentsProps={{
        row: {
          onMouseEnter: handlePopperOpen,
          onMouseLeave: handlePopperClose,
        },
      }}
      style={{ border: "none", borderBottom: "1px solid #e0e0e0" }}
      onCellDoubleClick={hanleOpenFile}
    />
  );
}
