import { useLazyQuery } from "@apollo/client";
import React from "react";
import { EventUploadTriggerContext } from "../../../../contexts/EventUploadTriggerContext";
import {
  GetFileTypeFromFullType,
  accumulateArray,
} from "../../../../functions";
import useDeepEqualEffect from "../../../../hooks/useDeepEqualEffect";
import { QUERY_GET_FILE } from "../apollo";

const useFetchFiles = ({ user } = {}) => {
  const eventUploadTrigger = React.useContext(EventUploadTriggerContext);
  const fileTypeList = [
    "pdf",
    "txt",
    "docx",
    "xlsx",
    "doc",
    "json",
    "md",
    "xml",
    "yaml",
    "html",
    "css",
    "js",
    "php",
    "rb",
    "swift",
    "go",
    "c",
    "cpp",
    "java",
    "py",
    "ini",
    "cfg",
    "conf",
  ];
  const [getData, { data: dataFetching }] = useLazyQuery(QUERY_GET_FILE, {
    fetchPolicy: "no-cache",
  });

  const getCustomFiles = () => {
    return getData({
      variables: {
        where: {
          status: "active",
          createdBy: user?._id,
        },
        noLimit: true,
        orderBy: "updatedAt_DESC",
      },
    });
  };

  useDeepEqualEffect(() => {
    getCustomFiles();
  }, [user, eventUploadTrigger.triggerData]);

  useDeepEqualEffect(() => {
    if (eventUploadTrigger.triggerData.isTriggered) {
      getCustomFiles();
    }
  }, [eventUploadTrigger.triggerData]);

  const data = React.useMemo(() => {
    const queryData = dataFetching?.files?.data || [];
    const queryTotal = dataFetching?.files?.total || null;

    const totalSize = accumulateArray(queryData, "size");

    const totalActiveSize = accumulateArray(
      queryData.filter((data) => data.status === "active"),
      "size"
    );

    const totalDownload = accumulateArray(queryData, "totalDownload");

    const documentFileData = queryData.filter(
      (data) => data.fileType.split("/")[0] === "application"
    );

    const imageFileData = queryData.filter(
      (data) => GetFileTypeFromFullType(data.fileType) === "image"
    );

    const videoFileData = queryData.filter(
      (data) => GetFileTypeFromFullType(data.fileType) === "video"
    );

    const audioFileData = queryData.filter(
      (data) => GetFileTypeFromFullType(data.fileType) === "audio"
    );

    const textFileData = queryData.filter(
      (data) => GetFileTypeFromFullType(data.fileType) === "text"
    );

    const otherFileData = queryData.filter((data) => {
      const dataFileType = GetFileTypeFromFullType(data.fileType);
      return (
        dataFileType !== "image" &&
        dataFileType !== "video" &&
        dataFileType !== "audio" &&
        dataFileType !== "text" &&
        data.fileType.split("/")[0] !== "application" &&
        !data.fileType &&
        !fileTypeList.some((fileType) => fileType === dataFileType)
      );
    });

    return {
      data: queryData,
      downloadedDataCount: accumulateArray(
        queryData.filter((data) => data.totalDownload >= 1),
        "totalDownload"
      ),
      total: queryTotal,
      totalSize,
      totalActiveSize,
      totalDownload,
      documentFileData: {
        totalLength: documentFileData.length,
        totalSize: accumulateArray(documentFileData, "size"),
      },
      imageFileData: {
        totalLength: imageFileData.length,
        totalSize: accumulateArray(imageFileData, "size"),
      },
      textFileData: {
        totalLength: textFileData.length,
        totalSize: accumulateArray(textFileData, "size"),
      },
      videoFileData: {
        totalLength: videoFileData.length,
        totalSize: accumulateArray(videoFileData, "size"),
      },
      audioFileData: {
        totalLength: audioFileData.length,
        totalSize: accumulateArray(audioFileData, "size"),
      },
      otherFileData: {
        totalLength: otherFileData.length,
        totalSize: accumulateArray(otherFileData, "size"),
      },
    };
  }, [dataFetching]);

  return {
    data,
    getData: getCustomFiles,
  };
};

export default useFetchFiles;
