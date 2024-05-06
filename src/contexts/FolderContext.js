import { useLazyQuery } from "@apollo/client";
import { createContext, useEffect, useReducer, useState } from "react";
import { decryptData, encryptData, folderIdLocalKey } from "../functions";
import { QUERY_FOLDERS } from "./apollo/Folder";

export const FolderContext = createContext({});

const reducer = (state, action) => {
  switch (action.type) {
    default:
      // localStorage.setItem("folderId", action.payload);
      const folderEncrypted = encryptData(JSON.stringify(action.payload));
      localStorage.setItem(folderIdLocalKey, folderEncrypted);
      return action.payload;
  }
};

const FolderProvider = ({ children }) => {
  // const folderIdStorage = localStorage.getItem("folderId");
  const folderIdStorage = localStorage.getItem(folderIdLocalKey);
  const folderDecrypted = decryptData(folderIdStorage);

  const [folderId, dispatch] = useReducer(reducer, folderDecrypted);
  const [getFolders, { data: folderData }] = useLazyQuery(QUERY_FOLDERS, {
    fetchPolicy: "no-cache",
  });

  const [triggerFolder, setTriggerFolder] = useState(false);
  const folderPath = `${window.origin}/folder`;
  const currentPath = `${window.origin}${location.pathname.slice(
    0,
    location.pathname.lastIndexOf("/"),
  )}`;

  const handleTriggerFolder = () => {
    setTriggerFolder(!triggerFolder);
  };

  const setFolderId = (id) => {
    dispatch({ payload: id });
  };

  useEffect(() => {
    if (folderPath !== currentPath) {
      // localStorage.setItem("folderId", 0);
      const folderEncrypted = encryptData(JSON.stringify("0"));
      localStorage.setItem(folderIdLocalKey, folderEncrypted);
      setFolderId(0);
    }
  }, [location]);

  useEffect(() => {
    const handleStorageChange = (e) => {
      if (
        // e.key === "folderId"
        e.key === folderIdLocalKey
      ) {
        if (!e.newValue) {
          // localStorage.setItem("folderId", e.oldValue);
          localStorage.setItem(folderIdLocalKey, e.oldValue);
        }
      }
    };
    window.addEventListener("storage", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  useEffect(() => {
    if (folderId) {
      getFolders({
        variables: {
          where: {
            _id: folderId,
          },
        },
      });
    }
  }, [folderId]);

  return (
    <FolderContext.Provider
      value={{
        folderId,
        triggerFolder,
        trackingFolderData: folderData?.folders?.data?.[0] || null,
        setFolderId,
        handleTriggerFolder,
      }}
    >
      {children}
    </FolderContext.Provider>
  );
};

export default FolderProvider;
