import {
  Box,
  Button,
  Container,
  IconButton,
  Paper,
  Typography,
} from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";
import React, { useState } from "react";
import { FaRegEdit } from "react-icons/fa";
import { TbDownload, TbUpload } from "react-icons/tb";
import { VscListSelection } from "react-icons/vsc";

import { DataGrid } from "@mui/x-data-grid";
import { useMemo } from "react";
import { FileIcon, defaultStyles } from "react-file-icon";

// component
import {
  ConvertBytetoMBandGB,
  DateFormat,
  GetFileType,
  formatIndochinaDate,
  formatMomentDate,
} from "../../../functions";
import useAuth from "../../../hooks/useAuth";
import FileCard from "../components/FileCard";
import SwitchPages from "../components/SwitchPages";
import * as MUI from "./../css/folderStyle";
export default function CardRecent(props) {
  const { user } = useAuth();
  const { recentFiles } = props;
  const isMobile = useMediaQuery("(max-width:768px)");
  const [toggle, setToggle] = React.useState("list");
  const [actionStatus, setActionStatus] = useState("edit");
  const [recentFile, setRecentFile] = React.useState([]);

  const handleToggle = (value) => {
    setToggle(value);
    localStorage.setItem("toggle", value);
  };
  const columns = [
    {
      field: "filename",
      headerName: "Name",
      flex: 1,
      renderCell: (params) => {
        return (
          <div style={{ display: "flex", alignItems: "center" }}>
            <Box sx={{ width: "20px", textAlign: "center" }} mt={2}>
              <FileIcon
                extension={GetFileType(params?.row?.filename)}
                {...defaultStyles[GetFileType(params?.row?.filename)]}
              />
            </Box>
            &nbsp;
            <span>{params?.row?.filename}</span>
          </div>
        );
      },
    },

    {
      field: "size",
      headerName: "File size",
      flex: 1,
      renderCell: (params) => {
        return <span>{ConvertBytetoMBandGB(params.row.size)}</span>;
      },
    },
    {
      field: "folder_name",
      headerName: "Location",
      flex: 1,
      renderCell: (params) => {
        return (
          <span>
            {params.row.folder_id._id ? params.row.folder_id._id : "My Cloud"}
          </span>
        );
      },
    },
    {
      field: "updatedAt",
      headerName: "Date",
      flex: 1,
      renderCell: (params) => {
        return <span>{DateFormat(params.row.createdAt)}</span>;
      },
    },
  ];

  const rows = useMemo(
    () =>
      props?.recentFile?.map((row, index) => ({
        ...row,
        id: row._id,
      })) || [],
    [props?.recentFile]
  );

  const handleQuery = async () => {
    const allFiles = await recentFiles({
      variables: {
        where: {
          createdBy: user._id,
          status: "active",
          actionStatus: actionStatus,
        },
        limit: 20,
        orderBy: "actionDate_DESC",
      },
    });
    if (allFiles) {
      setRecentFile(allFiles?.getRecentFile?.data);
    }
  };

  const currentDate = [
    {
      label: "Today",
      dateRange: {
        start: new Date(),
        end: new Date(),
      },
    },
    {
      label: "Yesterday",
      dateRange: {
        start: new Date(new Date().setDate(new Date().getDate() - 1)),
        end: new Date(new Date().setDate(new Date().getDate() - 1)),
      },
    },
    {
      label: "Earlier this week",
      dateRange: {
        start: new Date(new Date().setDate(new Date().getDate() - 2)),
        end: new Date(new Date().setDate(new Date().getDate() - 7)),
      },
    },
  ];

  return (
    <div>
      <MUI.TitleAndSwitch sx={{ mt: 3 }}>
        <MUI.TitleAndIcon>
          <Typography variant="h3" sx={{ ml: 2, mt: 3 }}>
            Recent
          </Typography>
        </MUI.TitleAndIcon>
        <SwitchPages
          handleToggle={handleToggle}
          toggle={toggle}
          setToggle={setToggle}
        />
      </MUI.TitleAndSwitch>
      {isMobile ? (
        <MUI.ListButtonRecent>
          <IconButton
            sx={{
              ml: 3,
              color: "#4B465C",
            }}
          >
            <VscListSelection />
          </IconButton>
          <IconButton>
            <FaRegEdit />
          </IconButton>
          <IconButton>
            <TbDownload />
          </IconButton>
          <IconButton>
            <TbUpload />
          </IconButton>
        </MUI.ListButtonRecent>
      ) : (
        <MUI.ListButtonRecent>
          <Button
            variant={actionStatus == "edit" ? "contained" : "string"}
            sx={{
              ml: 3,
              color: `${actionStatus == "edit" ? "#fff" : "#4B465C"}`,
            }}
            startIcon={<FaRegEdit size="18px" />}
            onClick={() => {
              setActionStatus("edit");
            }}
          >
            Lasted Edit
          </Button>
          <Button
            variant={actionStatus == "upload" ? "contained" : "string"}
            sx={{
              ml: 3,
              color: `${actionStatus == "upload" ? "#fff" : "#4B465C"}`,
            }}
            startIcon={<TbUpload />}
            onClick={() => {
              setActionStatus("upload");
            }}
          >
            Lasted Upload
          </Button>
          <Button
            variant={actionStatus == "download" ? "contained" : "string"}
            sx={{
              ml: 3,
              color: `${actionStatus == "download" ? "#fff" : "#4B465C"}`,
            }}
            startIcon={<TbDownload />}
            onClick={() => {
              handleQuery();
              setActionStatus("download");
            }}
          >
            Lasted Download
          </Button>
        </MUI.ListButtonRecent>
      )}
      {toggle == "list" ? (
        <Container maxWidth={isMobile ? "sm" : false} component={Paper}>
          {props?.recentFile?.length > 0 && (
            <Box sx={{ mt: 2 }}>
              <DataGrid
                autoHeight
                rows={rows}
                checked={true}
                columns={columns}
                disableColumnFilter
                disableColumnMenu
                rowsPerPageOptions={[]}
                style={{ border: "none" }}
              />
            </Box>
          )}
        </Container>
      ) : (
        <Container maxWidth={isMobile ? "sm" : false} component={Paper}>
          {currentDate.map((timer) => {
            const filterData = rows.filter((item) => {
              return (
                formatMomentDate(item?.actionDate) <=
                  formatIndochinaDate(timer?.dateRange.start) &&
                formatMomentDate(item?.actionDate) >=
                  formatIndochinaDate(timer?.dateRange.end)
              );
            });
            if (filterData?.length > 0) {
              return (
                <>
                  {actionStatus == "edit" && (
                    <>
                      <MUI.TitleDate>
                        {filterData?.length > 0 ? timer.label : ""}
                      </MUI.TitleDate>
                      <FileCard data={filterData} />
                    </>
                  )}
                  {actionStatus == "upload" && (
                    <>
                      <MUI.TitleDate>
                        {filterData?.length > 0 ? timer.label : ""}
                      </MUI.TitleDate>
                      <FileCard data={filterData} />
                    </>
                  )}

                  {actionStatus == "download" && (
                    <>
                      <MUI.TitleDate>
                        {filterData?.length > 0 ? timer.label : ""}
                      </MUI.TitleDate>
                      <FileCard data={filterData} />
                    </>
                  )}
                </>
              );
            }
          })}
        </Container>
      )}
    </div>
  );
}
