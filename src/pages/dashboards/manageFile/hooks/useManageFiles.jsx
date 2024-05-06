import { useLazyQuery } from "@apollo/client";
import React from "react";
import { GET_FILES } from "../apollo";

const useManageFiles = ({ filter }) => {
  const [getFiles, { data: dataFiles }] = useLazyQuery(GET_FILES, {
    fetchPolicy: "no-cache",
  });
  const [selectedRow, setSelectedRow] = React.useState([]);

  const customGetFiles = () => {
    const {
      pageLimit,
      owner,
      status,
      currentPageNumber,
      createdAt,
      fileType,
      filename,
      orderByMostDownload,
      fileDrop,
    } = filter;
    const skip = (currentPageNumber - 1) * pageLimit;

    getFiles({
      variables: {
        orderBy: "createdAt_DESC",
        ...(orderByMostDownload && {
          orderBy:
            orderByMostDownload === "asc"
              ? "DOWNLOAD_LOW_TO_HIGH"
              : "DOWNLOAD_HIGH_TO_LOW",
        }),
        limit: pageLimit,
        skip,
        where: {
          ...(fileDrop && {
            dropUrl: fileDrop,
          }),
          ...(owner && {
            createdBy: owner,
          }),
          ...(status && {
            status,
          }),
          ...(fileType && {
            fileType,
          }),
          ...(filename && {
            filename,
          }),
          ...(createdAt.startDate &&
            createdAt.endDate && {
              createdAtBetween: [createdAt.startDate, createdAt.endDate],
            }),
        },
        ...(fileDrop && {
          request: "backoffice",
        }),
      },
    });
  };

  React.useEffect(() => {
    customGetFiles();
  }, [filter, getFiles]);

  return {
    selectedRow,
    setSelectedRow,
    getFiles,
    customGetFiles,
    data: dataFiles?.files?.data?.map((data, index) => ({
      ...data,
      no: index + 1,
    })),
    total: dataFiles?.files?.total,
  };
};

export default useManageFiles;
