import { useLazyQuery } from "@apollo/client";
import React from "react";
import { QUERY_FILES, QUERY_FOLDERS, QUERY_SHARES } from "../apollo";

const useFetchSharedSubFoldersAndFiles = (id, user) => {
  const [getData, { data: dataFetching, called }] = useLazyQuery(QUERY_SHARES, {
    fetchPolicy: "no-cache",
  });
  const [isDataFound, setDataFound] = React.useState(null);
  const [mainData, setMainData] = React.useState(null);
  const [getFolderData] = useLazyQuery(QUERY_FOLDERS, {
    fetchPolicy: "no-cache",
  });

  const [getFileData] = useLazyQuery(QUERY_FILES, {
    fetchPolicy: "no-cache",
  });

  const getSharedSubFoldersAndFiles = () => {
    getData({
      variables: {
        where: {
          parentKey: id,
          toAccount: user.email,
        },
        orderBy: "updatedAt_DESC",
      },
    });
  };

  React.useEffect(() => {
    if (id && user?.email) {
      getSharedSubFoldersAndFiles();
    }
  }, [id, user]);

  React.useEffect(() => {
    const fetchData = async () => {
      const queryData = dataFetching?.getShare?.data || [];

      if (queryData !== undefined) {
        if (queryData.length > 0) {
          setDataFound(true);
        } else {
          setDataFound(false);
        }
      }
      const folderData = queryData?.filter(
        (data) => data.folderId._id && !data.fileId._id,
      );

      const fileData = queryData?.filter(
        (data) => !data.folderId._id && data.fileId._id,
      );

      const result = {
        folders: {
          data: await Promise.all(
            folderData
              .map(async (data) => {
                const [folderById] = (
                  await getFolderData({
                    variables: {
                      where: {
                        _id: data.folderId._id,
                        createdBy: data.ownerId._id,
                      },
                    },
                  })
                ).data.folders.data;
                if (folderById) {
                  return {
                    ...folderById,
                    sharedId: data._id,
                    name: folderById.folder_name,
                    type: folderById.folder_type,
                    newName: folderById.newFolder_name,
                    id: data.folderId._id,
                    isContainsFiles:
                      folderById.file_id?.filter((el) => el.status === "active")
                        ?.length > 0
                        ? true
                        : false ||
                            folderById.parentkey?.filter(
                              (el) => el.status === "active",
                            )?.length > 0
                          ? true
                          : false,
                    // isContainsFiles:
                    //   folderById.file_id.filter((data) => data._id)?.length > 0 ||
                    //   folderById.parentkey.filter((data) => data._id)?.length > 0,
                    pin: folderById.pin ? 1 : 0,
                    checkTypeItem: "folder",
                    permission: data.permission,
                  };
                }
              })
              .filter((data) => data),
          ),
          total: folderData.length,
        },

        files: {
          data: await Promise.all(
            fileData
              .map(async (data) => {
                const [fileById] = (
                  await getFileData({
                    variables: {
                      where: {
                        _id: data.fileId._id,
                        createdBy: data.ownerId._id,
                      },
                    },
                  })
                ).data.files.data;
                if (fileById) {
                  return {
                    ...fileById,
                    sharedId: data._id,
                    name: fileById.filename,
                    type: fileById.fileType,
                    newName: fileById.newFilename,
                    id: fileById._id,
                    favorite: fileById.favorite ? 1 : 0,
                    totalDownload: fileById.totalDownload + 1,
                    checkTypeItem: "file",
                    permission: data.permission,
                  };
                }
              })
              .filter((data) => data),
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
    refetch: getSharedSubFoldersAndFiles,
    setData: setMainData,
  };
};

export default useFetchSharedSubFoldersAndFiles;
