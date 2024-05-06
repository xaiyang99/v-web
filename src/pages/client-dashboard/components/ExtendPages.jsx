import { useLazyQuery } from "@apollo/client";
import { Base64 } from "js-base64";
import React, { useEffect } from "react";
import { FileIcon, defaultStyles } from "react-file-icon";
import { useParams } from "react-router-dom";

// material ui icon and component
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { Typography } from "@mui/material";
import { BiFolder } from "react-icons/bi";
import SwitchPages from "../components/SwitchPages";

// component
import * as MUI from "./../css/folderStyle";

// graphql
import { QUERY_SUBFOLDER_FILE } from "../folder/apollo/folder";
import DropdownMenu from "./DropdownMenu";
import TableFormat from "./TableFormat";

//function
import styled from "@emotion/styled";
import { GetFileType } from "../../../functions";

function ExtendPages() {
  const params = useParams();
  const [toggle, setToggle] = React.useState("list");
  const handleToggle = (value) => {
    setToggle(value);
    localStorage.setItem("toggle", value);
  };

  const [optionFormat, setOptionFormat] = React.useState(true);
  const [getSubFolderAndFile, { reload, data, error, refetch: refecthFolder }] =
    useLazyQuery(QUERY_SUBFOLDER_FILE);
  const [listSubFolder, setListSubfolder] = React.useState([]);

  const options = (value) => {
    setOptionFormat(value);
  };

  useEffect(() => {
    const localStorageToggled = localStorage.getItem("toggle");
    if (localStorageToggled) {
      setOptionFormat(localStorageToggled === "true" ? true : false);
    } else {
      localStorage.setItem("toggle", "true");
    }
  }, []);

  // get sub folder
  useEffect(() => {
    const idURL = Base64.decode(params?.id);
    if (reload) return;
    if (error) return;
    getSubFolderAndFile({
      variables: {
        where: {
          url: idURL,
        },
        orderBy: "createdAt_DESC",
      },
    });
    if (data) {
      setListSubfolder(data.querySubFolderAndFile.data);
    }
  }, [data]);

  const FileIconContainer = styled.div(() => ({
    display: "flex",
    alignItems: "center",
    svg: {
      fontSize: "15px",
    },
  }));

  const columns = [
    {
      field: "type",
      headerName: "Type",
      sortable: false,
      renderCell: (params) => {
        const { name, newName, type, path } = params.row;
        return (
          <FileIconContainer>
            <FileIcon
              extension={GetFileType(name)}
              {...{ ...defaultStyles[GetFileType(name)] }}
            />
          </FileIconContainer>
        );
      },
      headerAlign: "center",
      width: 50,
      minWidth: 50,
      align: "center",
      disableColumnMenu: true,
    },
    {
      field: "name",
      headerName: "Name",
      editable: false,
      flex: 1,
    },
    {
      field: "size",
      headerName: "Size",
      editable: false,
      flex: 1,
    },
    {
      field: "path",
      headerName: "Path",
      editable: false,
      flex: 1,
    },
    {
      field: "menu",
      headerName: "",
      width: 50,
      minWidth: 50,
      disableColumnMenu: true,
      sortable: false,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => {
        return <DropdownMenu icon={<MoreVertIcon />} />;
      },
    },
  ];

  const onCellDoubleClick = (e) => {
    if (e.row.check === "main") {
    }
  };

  return (
    <>
      <MUI.TitleAndSwitch>
        <MUI.TitleAndIcon>
          <BiFolder />
          <Typography variant="h3" sx={{ ml: 2 }}>
            My folders
          </Typography>
        </MUI.TitleAndIcon>
        <SwitchPages
          handleToggle={handleToggle}
          toggle={toggle}
          setToggle={setToggle}
        />
      </MUI.TitleAndSwitch>
      <TableFormat
        data={listSubFolder}
        dataGrid={{
          onCellDoubleClick,
          columns,
          hideFooter: true,
        }}
      />
    </>
  );
}

export default ExtendPages;
