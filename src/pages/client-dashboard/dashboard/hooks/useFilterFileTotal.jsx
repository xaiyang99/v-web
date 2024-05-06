import React from "react";
import {
  ConvertBytetoMBandGB,
  intToPrettyString,
  stringPluralize,
} from "../../../../functions";
import * as Icon from "../icons";

const useFilterFileTotal = ({ totalStorage, files, dataSpace }) => {
  const data = React.useMemo(() => {
    return [
      {
        title: "available storage",
        total: dataSpace?.getSpaces?.totalStorage
          ? ConvertBytetoMBandGB(
              Number(dataSpace?.getSpaces?.totalStorage || 0) -
                Number(dataSpace?.getSpaces?.usedStorage || 0),
            )
          : "0 B",
        icon: {
          element: <Icon.TbFileReportIcon />,
          style: {
            color: "#10b981",
            backgroundColor: "rgba(23,118,107,0.1)",
          },
        },
      },
      {
        title: "used storage",
        total: dataSpace?.getSpaces?.usedStorage
          ? ConvertBytetoMBandGB(Number(dataSpace?.getSpaces?.usedStorage || 0))
          : "0 B",
        icon: {
          element: <Icon.TbFileSymlinkIcon />,
          style: {
            color: "#ffa44f",
            backgroundColor: "#ffefe1",
          },
        },
      },

      {
        title: "active files",
        total: totalStorage
          ? ConvertBytetoMBandGB(Number(files.totalActiveSize))
          : "0 B",
        icon: {
          element: <Icon.TbFileSearchIcon />,
          style: {
            color: "#29c770",
            backgroundColor: "#e5f8ed",
          },
        },
      },

      {
        title: "total downloads",
        total: totalStorage
          ? `${intToPrettyString(files.downloadedDataCount)} ${stringPluralize(
              files.downloadedDataCount,
              "Download",
              "s",
            )}`
          : "0 B",
        icon: {
          element: <Icon.TbFileDownloadIcon />,
          style: {
            color: "#eb5f60",
            backgroundColor: "#fceaea",
          },
        },
      },
    ];
  }, [totalStorage, files, dataSpace]);

  return {
    data,
  };
};

export default useFilterFileTotal;
