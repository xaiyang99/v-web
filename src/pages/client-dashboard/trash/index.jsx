import { useLazyQuery, useMutation } from "@apollo/client";
import React, { useState } from "react";
import {
  DELETE_FILE,
  QUERY_FOLDER_FILE_DELETED,
  RESTORE_FILE,
  RESTORE_FOLDER,
  TRASH_FOLDER,
} from "./apollo";

// component
import { Typography } from "@mui/material";
import useAuth from "../../../hooks/useAuth";
import {
  isDateEarlierThisMonth,
  isDateEarlierThisWeek,
  isDateEarlierThisYear,
  isDateLastMonth,
  isDateLastWeek,
  isDateLastYear,
  isDateOnToday,
  isDateYesterday,
} from "../../../utils/date";
import DeletedFoldersAndFilesDataGrid from "../components/DeletedFoldersAndFilesDataGrid";
import SwitchPages from "../components/SwitchPages";
import FileCardContainer from "../components/file/FileCardContainer";
import FileCardItem from "../components/file/FileCardItem";
import * as MUI from "../css/deletedFileStyle";

//icons
import { useEffect } from "react";
import { errorMessage, successMessage } from "../../../components/Alerts";
import SimpleBar from "../../../components/bar/SimpleBar";
import AlertDialog from "../../../components/deleteDialog";
import { ENV_KEYS } from "../../../constants";
import {
  GetFileTypeFromFullType,
  getFilenameWithoutExtension,
  handleGraphqlErrors,
  truncateName,
} from "../../../functions";
import Empty from "../components/Empty";
import MenuDropdownItem from "../components/menu/MenuDropdownItem";
import { useMenuDropdownState } from "../components/menu/MenuDropdownProvider";
import { trashMenuItems } from "../components/menu/MenuItems";
import * as MUI_TOGLE from "../css/trashStyle";
import * as Icon from "./icons";
const { REACT_APP_BUNNY_PULL_ZONE } = process.env;

function Index() {
  const [toggle, setToggle] = React.useState(null);
  const { setIsAutoClose } = useMenuDropdownState();
  const { user } = useAuth();
  const [dataDeletedFoldersAndFiles, setDataDeletedFoldersAndFiles] =
    useState(null);
  const [getDeletedFoldersAndFiles, { data, loading }] = useLazyQuery(
    QUERY_FOLDER_FILE_DELETED,
    {
      fetchPolicy: "no-cache",
    },
  );

  const [
    isDataDeletedFoldersAndFilesFound,
    setIsDataDeletedFoldersAndFilesFound,
  ] = useState(null);
  const [dataForEvents, setDataForEvents] = React.useState({
    action: null,
    data: {},
  });

  const [restoreFolder] = useMutation(RESTORE_FOLDER);
  const [restoreFile] = useMutation(RESTORE_FILE);
  const [deleteFolder] = useMutation(TRASH_FOLDER);
  const [deleteFile] = useMutation(DELETE_FILE);

  // dialog confirmation
  const [isRestoreOpen, setIsRestoreOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  useEffect(() => {
    if (dataForEvents.action && dataForEvents.data) {
      menuOnClick(dataForEvents.action);
    }
  }, [dataForEvents.action]);

  const customGetDeletedFolderFile = () => {
    getDeletedFoldersAndFiles({
      variables: {
        where: {
          createdBy: user._id,
        },
        orderBy: "updatedAt_DESC",
      },
    });
  };

  const resetDataForEvents = () => {
    setDataForEvents((state) => ({
      ...state,
      action: null,
      data: {},
    }));
  };

  const menuOnClick = (action) => {
    setIsAutoClose(true);
    switch (action) {
      case "restore":
        handleRestore();
        break;

      case "delete forever":
        setIsDeleteOpen(true);
        break;
      default:
        return;
    }
  };

  const handleRestore = async () => {
    if (dataForEvents.data.checkTypeItem === "folder") {
      try {
        await restoreFolder({
          variables: {
            data: {
              status: "active",
            },
            where: {
              _id: dataForEvents.data._id,
            },
          },
          onCompleted: async () => {
            successMessage(
              `Restore ${dataForEvents.data.name} successfully`,
              3000,
            );
            customGetDeletedFolderFile();
            resetDataForEvents();
            setIsRestoreOpen(false);
          },
        });
      } catch (error) {
        let cutErr = error.message.replace(/(ApolloError: )?Error: /, "");
        errorMessage(
          handleGraphqlErrors(
            cutErr || "Something went wrong, Please try again",
          ),
          3000,
        );
      }
    }

    if (dataForEvents.data.checkTypeItem === "file") {
      try {
        await restoreFile({
          variables: {
            data: {
              status: "active",
            },
            where: {
              _id: dataForEvents.data._id,
            },
          },
          onCompleted: async () => {
            successMessage(
              `Restore ${dataForEvents.data.name} successfully`,
              3000,
            );
            resetDataForEvents();
            customGetDeletedFolderFile();
            setIsRestoreOpen(false);
          },
        });
      } catch (error) {
        let cutErr = error.message.replace(/(ApolloError: )?Error: /, "");
        errorMessage(cutErr || "Something went wrong, Please try again", 3000);
      }
    }
  };

  const handleDeleteForever = async () => {
    if (dataForEvents.data.checkTypeItem === "folder") {
      await deleteFolder({
        variables: {
          where: {
            _id: dataForEvents.data._id,
            checkFolder: dataForEvents.data?.check,
          },
        },
        onCompleted: async () => {
          successMessage(
            `Delete ${dataForEvents.data.name} successfully`,
            3000,
          );
          resetDataForEvents();
          customGetDeletedFolderFile();
          setIsDeleteOpen(false);
        },
        onError: async () => {
          errorMessage("Something went wrong", 3000);
        },
      });
    }

    if (dataForEvents.data.checkTypeItem === "file") {
      await deleteFile({
        variables: {
          id: dataForEvents.data._id,
        },
        onCompleted: async () => {
          successMessage(
            `Delete ${dataForEvents.data.name} successfully`,
            3000,
          );
          customGetDeletedFolderFile();
          setIsDeleteOpen(false);
          resetDataForEvents();
        },
      });
    }
  };

  const handleToggle = (value) => {
    setToggle(value);
    localStorage.setItem("toggle", value);
  };

  useEffect(() => {
    function getDataSetting() {
      const localStorageToggled = localStorage.getItem("toggle");
      if (localStorageToggled) {
        setToggle(localStorageToggled === "list" ? "list" : "grid");
      } else {
        localStorage.setItem("toggle", "list");
        setToggle("list");
      }
    }

    getDataSetting();
  }, []);

  useEffect(() => {
    getDeletedFoldersAndFiles({
      variables: {
        where: {
          createdBy: user._id,
        },
        orderBy: "updatedAt_DESC",
      },
    });
  }, []);

  React.useEffect(() => {
    const queryData = data?.queryDeleteSubFolderAndFile?.data;
    setDataDeletedFoldersAndFiles(() => {
      const result = [
        { title: "Today", data: [] },
        { title: "Yesterday", data: [] },
        { title: "Earlier this week", data: [] },
        { title: "Last week", data: [] },
        { title: "Earlier this month", data: [] },
        { title: "Last month", data: [] },
        { title: "Earlier this year", data: [] },
        { title: "Last year", data: [] },
      ];

      if (queryData) {
        queryData.forEach((data) => {
          if (isDateOnToday(data.updatedAt)) {
            result[0].data.push(data);
          } else if (isDateYesterday(data.updatedAt)) {
            result[1].data.push(data);
          } else if (isDateEarlierThisWeek(data.updatedAt)) {
            result[2].data.push(data);
          } else if (isDateLastWeek(data.updatedAt)) {
            result[3].data.push(data);
          } else if (isDateEarlierThisMonth(data.updatedAt)) {
            result[4].data.push(data);
          } else if (isDateLastMonth(data.updatedAt)) {
            result[5].data.push(data);
          } else if (isDateEarlierThisYear(data.updatedAt)) {
            result[6].data.push(data);
          } else if (isDateLastYear(data.updatedAt)) {
            result[7].data.push(data);
          } else {
            result[7].data.push(data);
          }
        });
      }

      if (queryData !== undefined) {
        if (queryData.length > 0) {
          setIsDataDeletedFoldersAndFilesFound(true);
        } else {
          setIsDataDeletedFoldersAndFilesFound(false);
        }
      }
      return result.map((recentFiles) => {
        return {
          ...recentFiles,
          data: recentFiles.data.splice(0, 15).map((data) => ({
            id: data._id,
            ...data,
          })),
        };
      });
    });
  }, [data?.queryDeleteSubFolderAndFile?.data]);

  return (
    <MUI.TrashFilesContainer>
      <AlertDialog
        open={isRestoreOpen}
        onClose={() => {
          resetDataForEvents();
          setIsRestoreOpen(false);
        }}
        title="Are you sure?"
        onClick={handleRestore}
        message={""}
      />
      <AlertDialog
        open={isDeleteOpen}
        onClose={() => {
          resetDataForEvents();
          setIsDeleteOpen(false);
        }}
        title="Are you sure that you want to delete this item?"
        onClick={handleDeleteForever}
        message={"Note: Any deleted files or folders will not restore again!."}
      />
      <MUI_TOGLE.TitleAndSwitch>
        <MUI_TOGLE.SwitchItem>
          <Typography variant="h4">Trash For My Drive </Typography>
        </MUI_TOGLE.SwitchItem>
        {isDataDeletedFoldersAndFilesFound !== null &&
          isDataDeletedFoldersAndFilesFound && (
            <SwitchPages
              handleToggle={handleToggle}
              toggle={toggle === "grid" ? "grid" : "list"}
              setToggle={setToggle}
            />
          )}
      </MUI_TOGLE.TitleAndSwitch>

      {isDataDeletedFoldersAndFilesFound !== null &&
        isDataDeletedFoldersAndFilesFound && (
          <>
            <SimpleBar
              title="Items in trash will be deleted forever after 30 days"
              barStyle={{
                color: "#4B465C",
                backgroundColor: "#E0E0E0",
              }}
            />
            <MUI.TrashFilesList>
              {dataDeletedFoldersAndFiles &&
                dataDeletedFoldersAndFiles.map((dataDeletedFile, index) => {
                  return (
                    <React.Fragment key={index}>
                      {dataDeletedFile.data.length > 0 && (
                        <MUI.TrashFilesItem>
                          <Typography variant="h4" fontWeight="bold">
                            {dataDeletedFile.title}
                          </Typography>
                          {toggle === "grid" && (
                            <FileCardContainer>
                              {dataDeletedFile.data.map((data, index) => {
                                return (
                                  <FileCardItem
                                    cardProps={{
                                      onClick: () => {},
                                    }}
                                    imageUrl={
                                      REACT_APP_BUNNY_PULL_ZONE +
                                      user.newName +
                                      "-" +
                                      user._id +
                                      "/" +
                                      (data.newPath
                                        ? truncateName(data.newPath)
                                        : "") +
                                      data.newName
                                    }
                                    thumbnailImageUrl={
                                      REACT_APP_BUNNY_PULL_ZONE +
                                      user.newName +
                                      "-" +
                                      user._id +
                                      "/" +
                                      ENV_KEYS.REACT_APP_THUMBNAIL_PATH +
                                      "/" +
                                      getFilenameWithoutExtension(
                                        data.newName,
                                      ) +
                                      `.${ENV_KEYS.REACT_APP_THUMBNAIL_EXTENSION}`
                                    }
                                    fileType={GetFileTypeFromFullType(
                                      data.type,
                                    )}
                                    isContainFiles={
                                      !!data.totalItems
                                        ? data.totalItems > 0
                                          ? true
                                          : false
                                        : false
                                    }
                                    name={data.name}
                                    key={index}
                                    menuItems={trashMenuItems.map(
                                      (menuItem, index) => {
                                        return (
                                          <MenuDropdownItem
                                            onClick={() => {
                                              setDataForEvents({
                                                action: menuItem.action,
                                                data,
                                              });
                                            }}
                                            key={index}
                                            title={menuItem.title}
                                            icon={menuItem.icon}
                                          />
                                        );
                                      },
                                    )}
                                  />
                                );
                              })}
                            </FileCardContainer>
                          )}
                          {toggle === "list" && (
                            <DeletedFoldersAndFilesDataGrid
                              data={dataDeletedFile.data}
                              handleEvent={(action, data) => {
                                setDataForEvents({
                                  action,
                                  data,
                                });
                              }}
                            />
                          )}
                        </MUI.TrashFilesItem>
                      )}
                    </React.Fragment>
                  );
                })}
            </MUI.TrashFilesList>
          </>
        )}

      {isDataDeletedFoldersAndFilesFound !== null &&
        !isDataDeletedFoldersAndFilesFound && (
          <Empty
            icon={<Icon.TrashIcon />}
            title="Trash is Empty"
            context="Items moved to the trash will be deleted forever after 30 days"
          />
        )}
    </MUI.TrashFilesContainer>
  );
}

export default Index;
