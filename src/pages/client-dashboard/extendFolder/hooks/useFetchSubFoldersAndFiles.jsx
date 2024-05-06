import { useLazyQuery } from "@apollo/client";
import React from "react";
import {
  QUERY_FILES,
  QUERY_FOLDERS,
  QUERY_SUB_FOLDERS_AND_FILES,
} from "../apollo";

const useFetchSubFoldersAndFiles = ({ id, limit, currentPage, toggle }) => {
  const [getData, { data: dataFetching, called }] = useLazyQuery(
    QUERY_SUB_FOLDERS_AND_FILES,
    {
      fetchPolicy: "no-cache",
    },
  );
  const [isDataFound, setDataFound] = React.useState(null);
  const [mainData, setMainData] = React.useState(null);
  const [getFolderData] = useLazyQuery(QUERY_FOLDERS, {
    fetchPolicy: "no-cache",
  });

  const [getFileData] = useLazyQuery(QUERY_FILES, {
    fetchPolicy: "no-cache",
  });

  React.useEffect(() => {
    if (id) {
      getData({
        variables: {
          where: {
            _id: id,
          },
          orderBy: "updatedAt_DESC",
          // limit,
          // skip: limit * (currentPage - 1),
        },
      });
    }
  }, [id]);

  React.useEffect(() => {
    const fetchData = async () => {
      const queryData = dataFetching?.querySubFolderAndFile?.data || [];

      if (queryData !== undefined) {
        if (queryData.length > 0) {
          setDataFound(true);
        } else {
          setDataFound(false);
        }
      }
      const folderData = queryData?.filter(
        (data) => data.checkTypeItem === "folder",
      );

      const fileData = queryData?.filter(
        (data) => data.checkTypeItem === "file",
      );

      const result = {
        folders: {
          data: await Promise.all(
            folderData.map(async (data) => {
              const [folderById] = (
                await getFolderData({
                  variables: {
                    where: {
                      _id: data._id,
                      createdBy: data?.createdBy?._id,
                    },
                  },
                })
              ).data.folders.data;

              return {
                ...data,
                id: data._id,
                // isContainsFiles:
                //   folderById.file_id?.filter((el) => el.status === "active")
                //     ?.length > 0
                //     ? true
                //     : false ||
                //         folderById.parentkey?.filter(
                //           (el) => el.status === "active",
                //         )?.length > 0
                //       ? true
                //       : false,
                isContainsFiles: folderById.total_size
                  ? folderById.total_size > 0
                    ? true
                    : false
                  : 0,
                pin: folderById.pin ? 1 : 0,
              };
            }),
          ),
          total: folderData.length,
        },

        files: {
          data: await Promise.all(
            fileData.map(async (data) => {
              const [fileById] = (
                await getFileData({
                  variables: {
                    where: {
                      _id: data._id,
                    },
                  },
                })
              ).data.files.data;
              return {
                ...data,
                id: data._id,
                favorite: fileById.favorite ? 1 : 0,
                totalDownload: fileById.totalDownload,
              };
            }),
          ),
          total: fileData.length,
        },
      };
      setMainData(result);
    };
    fetchData();
  }, [dataFetching]);
  return {
    data: mainData,
    called,
    isDataFound,
    getData,
    setData: setMainData,
  };
};

export default useFetchSubFoldersAndFiles;
