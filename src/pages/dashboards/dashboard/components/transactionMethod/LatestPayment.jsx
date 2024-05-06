import { Chip } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import moment from "moment";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { numberWithCommas } from "../../../../../functions";
import { paymentState } from "../../../../../redux/slices/paymentSlice";

const LatestPayment = (props) => {
  const { t } = useTranslation();
  const paymentSelector = useSelector(paymentState);
  const columns = [
    {
      field: "paymentMethod",
      headerName: t("_card_type"),
      flex: 1,
      editable: false,
    },
    {
      field: "orderedAt",
      headerName: t("_date"),
      flex: 1,
      editable: false,
      renderCell: (params) => {
        return moment(params.row.orderedAt).format("DD MMM YYYY");
      },
    },
    {
      field: "status",
      headerName: t("_status"),
      flex: 1,
      editable: false,
      renderCell: (params) => {
        const status = params.row.status;
        if (status === "success") {
          return (
            <div style={{ color: "green" }}>
              <Chip
                sx={{ backgroundColor: "#dcf6e8", color: "#29c770" }}
                label={status}
                size="small"
              />
            </div>
          );
        } else if (status === "refunds") {
          return (
            <div>
              <Chip
                sx={{
                  backgroundColor: "rgba(168, 170, 174,0.16)",
                  color: "rgb(168, 170, 174)",
                }}
                label={status}
                size="small"
              />
            </div>
          );
        } else {
          return (
            <div>
              <Chip
                sx={{
                  backgroundColor: "rgba(234, 84, 85,0.16)",
                  color: "rgb(234, 84, 85)",
                }}
                label={status}
                size="small"
              />
            </div>
          );
        }
      },
    },
    {
      field: "amount",
      headerName: t("_trend"),
      flex: 1,
      editable: false,
      renderCell: (params) => {
        return `${paymentSelector.currencySymbol}${numberWithCommas(
          params.row.amount
        )}`;
      },
    },
  ];

  return (
    <div style={{ height: "100%", width: "100%" }}>
      <DataGrid
        {...{
          sx: {
            border: 0,
            "&>.MuiDataGrid-main": {
              "&>.MuiDataGrid-columnHeaders": {
                borderTop: "1px solid rgba(224, 224, 224, 1)",
              },

              "& div div div div >.MuiDataGrid-cell": {
                borderBottom: "none",
              },
            },
            "& .MuiDataGrid-cell:focus-within, & .MuiDataGrid-cell:focus": {
              outline: "none !important",
            },
            "& .MuiDataGrid-columnHeader:focus-within, & .MuiDataGrid-columnHeader:focus":
              {
                outline: "none !important",
              },
            "& .MuiDataGrid-columnSeparator": { display: "none" },
            "& .MuiDataGrid-virtualScroller": {
              overflowX: "hidden",
            },
          },
          checked: true,
          disableColumnFilter: true,
          disableColumnMenu: true,
          columns,
          getRowId: (row) => row?.no,
          hideFooter: true,
          rows: props.data,
          columns,
        }}
      />
    </div>
  );
};

export default LatestPayment;
