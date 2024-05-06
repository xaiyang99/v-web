import React from "react";
import { ConvertBytetoMBandGB, stringPluralize } from "../../../../functions";
import * as Icon from "../icons";

const useFilterFileByType = ({ files }) => {
  const data = React.useMemo(() => {
    return [
      {
        title: `${files.documentFileData.totalLength} ${stringPluralize(
          files.documentFileData.totalLength,
          "Document",
          "s"
        )}`,
        total: files
          ? ConvertBytetoMBandGB(files.documentFileData.totalSize)
          : 0,
        icon: {
          element: <Icon.ApplicationIcon />,
          style: {
            color: "#10b981",
            backgroundColor: "rgba(23,118,107,0.1)",
          },
        },
      },
      {
        title: `${files.imageFileData.totalLength} ${stringPluralize(
          files.imageFileData.totalLength,
          "Image",
          "s"
        )}`,
        total: files
          ? ConvertBytetoMBandGB(files.imageFileData.totalSize)
          : null,
        icon: {
          element: <Icon.ImageIcon />,
          style: {
            color: "#10b981",
            backgroundColor: "rgba(23,118,107,0.1)",
          },
        },
      },
      {
        title: `${files.videoFileData.totalLength} ${stringPluralize(
          files.videoFileData.totalLength,
          "Video",
          "s"
        )}`,
        total: files
          ? ConvertBytetoMBandGB(files.videoFileData.totalSize)
          : null,
        icon: {
          element: <Icon.VideoIcon />,
          style: {
            color: "#10b981",
            backgroundColor: "rgba(23,118,107,0.1)",
          },
        },
      },
      {
        title: `${files.audioFileData.totalLength} ${stringPluralize(
          files.audioFileData.totalLength,
          "Audio",
          "s"
        )}`,
        total: files
          ? ConvertBytetoMBandGB(files.audioFileData.totalSize)
          : null,
        icon: {
          element: <Icon.AudioIcon />,
          style: {
            color: "#10b981",
            backgroundColor: "rgba(23,118,107,0.1)",
          },
        },
      },
      {
        title: `${files.textFileData.totalLength} ${stringPluralize(
          files.textFileData.totalLength,
          "Text",
          "s"
        )}`,
        total: files
          ? ConvertBytetoMBandGB(files.textFileData.totalSize)
          : null,
        icon: {
          element: <Icon.TextIcon />,
          style: {
            color: "#10b981",
            backgroundColor: "rgba(23,118,107,0.1)",
          },
        },
      },
      {
        title: "Others",
        total: files
          ? ConvertBytetoMBandGB(files.otherFileData.totalSize)
          : null,
        icon: {
          element: <Icon.OthersIcon />,
          style: {
            color: "#10b981",
            backgroundColor: "rgba(23,118,107,0.1)",
          },
        },
      },
    ];
  }, [files]);
  return data;
};

export default useFilterFileByType;
