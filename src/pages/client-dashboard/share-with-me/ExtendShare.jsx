import { useLazyQuery } from "@apollo/client";
import { Box, Grid } from "@mui/material";
import React, { useEffect } from "react";
import { useParams } from "react-router-dom";

import { Base64 } from "js-base64";
import useAuth from "../../../hooks/useAuth";
import { QUERY_SHARE_ME } from "./apollo";
import ItemCardShare from "./cardShare";

function ExtendShare() {
  const param = useParams();
  const { user } = useAuth();
  const [optionFormat, setOptionFormat] = React.useState(true);
  const [getSubFolder, { reload, data, error, refetch: refecthFoler }] =
    useLazyQuery(QUERY_SHARE_ME);
  const [listSubfolder, setListSubfolder] = React.useState([]);
  const shareId = Base64.decode(param?.id);
  // const options = (value) => {
  //   setOptionFormat(value);
  // };

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
    if (reload) return;
    if (error) return;
    getSubFolder({
      variables: {
        where: {
          toAccount: user?.email,
          status: "active",
          isShare: "no",
          ref: shareId,
        },
      },
    });
    if (data) {
      setListSubfolder(data?.getShare?.data);
    }
  }, [data, getSubFolder, shareId]);

  return (
    <React.Fragment>
      <Box
        sx={{
          position: "fixed",
          right: 0,
          background: "#FFF",
          zIndex: "2",
          width: "100VW",
        }}
      >
        {/* format list card and table for file */}
        {/* <SwitchPages options={options} /> */}
      </Box>
      {optionFormat === true && (
        <Box sx={{ marginTop: "80px" }}>
          <Grid container spacing={2}>
            {listSubfolder.length > 0
              ? listSubfolder?.map((item, index) => (
                  <Grid
                    item
                    sm={6}
                    md={3}
                    lg={2}
                    xl={2}
                    flexGrow={1}
                    key={index}
                  >
                    <ItemCardShare
                      index={index}
                      itemId={item?._id}
                      fileId={item?.fileId?._id}
                      fileName={item?.fileId?.filename}
                      newfileName={item?.fileId?.newFileName}
                      fileUrl={item?.fileId?.url}
                      fileType={item?.fileId?.fileType}
                      parentkey={item?.parentkey}
                      folderId={item?.folderId?._id}
                      folderName={item?.folderId?.folder_name}
                      folderType={item?.folderId?.folder_type}
                      folderUrl={item?.folderId?.url}
                      checkFolder={item?.folderId?.checkFolder}
                      refecthFolder={refecthFoler}
                    />
                  </Grid>
                ))
              : null}
          </Grid>
        </Box>
      )}
    </React.Fragment>
  );
}

export default ExtendShare;
