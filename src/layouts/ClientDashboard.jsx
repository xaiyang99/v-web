import styled from "@emotion/styled";
import { useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Outlet, useLocation } from "react-router-dom";

import Navbar from "../client-components/navbar/Navbar";
import Sidebar from "../client-components/sidebar/Sidebar";
import dashboardItems from "../client-components/sidebar/dashboardItems";
import FloatingButton from "../components/FloatingButton";
import GlobalStyle from "../components/GlobalStyle";

import { Box, CssBaseline, Paper as MuiPaper } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { spacing } from "@mui/system";
import ShowUploadProgress from "../pages/client-dashboard/clound/ShowUpload";
import { useLazyQuery } from "@apollo/client";
import { QUERY_SETTING } from "../pages/dashboards/settings/apollo";

const drawerWidth = 300;

const Root = styled.div`
  display: flex;
  min-height: 100vh;
`;

const Drawer = styled.div`
  ${(props) => props.theme.breakpoints.up("md")} {
    width: ${drawerWidth}px;
    flex-shrink: 0;
  }
  background-color: ${(props) => props.theme.sidebar.header.background};
`;

const AppContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  max-width: 100%;
`;

const Paper = styled(MuiPaper)(spacing);

const MainContent = styled(Paper)`
  flex: 1;
  background: ${(props) => props.theme.palette.background.default};

  @media all and (-ms-high-contrast: none), (-ms-high-contrast: active) {
    flex: none;
  }

  .MuiPaper-root .MuiPaper-root {
    box-shadow: none;
  }
`;

const ClientDashboard = ({ children }) => {
  const router = useLocation();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [selectedFolderFiles, setSelectedFolderFiles] = useState([]);
  const [files, setFiles] = useState([]);
  const [hasFile, setHasFile] = useState(false);
  const [selectMore, setSelectMore] = useState(true);
  const [getSetting] = useLazyQuery(QUERY_SETTING, {
    fetchPolicy: "no-cache",
  });

  const settingKey = {
    viewMode: "DVMLAGH",
  };

  useEffect(() => {
    let timeoutId;
    if (selectMore === false) {
      timeoutId = setTimeout(() => {
        setSelectMore(true);
      }, 2000);
    }
    return () => {
      clearTimeout(timeoutId);
    };
  }, [selectMore]);

  useEffect(() => {
    const getDataSetting = async () => {
      await getSetting({
        variables: {
          where: {
            productKey: settingKey.viewMode,
          },
        },

        onCompleted: (data) => {
          let viewMode = data?.general_settings?.data || [];
          let toggleStorage = localStorage.getItem("toggle");

          if (!toggleStorage) {
            localStorage.setItem(
              "toggle",
              viewMode?.action === "list" ? "list" : "grid",
            );
          }
        },
      });
    };

    getDataSetting();
  }, []);

  //Modal;
  const handleClose = () => {
    setOpen(false);
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const isAllowed = location.pathname === "/my-cloud";

  const onDrop = useCallback(
    (acceptedFiles) => {
      const folderFiles = acceptedFiles.filter((file) =>
        file.path.startsWith("/"),
      );
      const filesOnly = acceptedFiles.filter(
        (file) => !file.path.startsWith("/"),
      );

      if (folderFiles.length > 0) {
        const data = [];
        for (let i = 0; i < folderFiles.length; i++) {
          const file = folderFiles[i];
          const newFile = new File([file], file.name, {
            type: file.type,
            lastModified: file.lastModified,
          });
          Object.defineProperty(newFile, "webkitRelativePath", {
            value: file.path.slice(1),
            writable: false,
          });
          data.push(newFile);
        }
        const filesByFolder = data.reduce((acc, file) => {
          const folderName = file.webkitRelativePath.split("/")[0];
          if (!acc[folderName]) {
            acc[folderName] = [];
          }
          acc[folderName].push(file);
          return acc;
        }, {});
        const folders = Object.values(filesByFolder);
        setSelectedFolderFiles((prevFiles) => [...prevFiles, ...folders]);
        setHasFile(false);
        setOpen(true);
      }

      if (filesOnly.length > 0) {
        setFiles([...files, ...filesOnly]);
        setHasFile(false);
        setOpen(true);
      }
    },
    [files, setFiles, setHasFile, setOpen, setSelectedFolderFiles],
  );

  const handleDragEnter = (e) => {
    e.preventDefault();
    setHasFile(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setHasFile(false);
  };

  const handleSelectMore = () => {
    setSelectMore(false);
  };

  const { getRootProps, getInputProps } = useDropzone({
    disabled: !isAllowed,
    onDrop,
    onDragEnter: handleDragEnter,
    onDragLeave: handleDragLeave,
    noClick: selectMore,
    noKeyboard: true,
    multiple: true,
  });

  const handleDelete = (index, type) => {
    if (type === "file") {
      setFiles(files.filter((_, i) => i !== index));
    }
    if (type === "folder") {
      setSelectedFolderFiles(selectedFolderFiles.filter((_, i) => i !== index));
    }
  };

  const handleRemoveAll = () => {
    setFiles([]);
    setSelectedFolderFiles([]);
  };

  // Close mobile menu when navigation occurs
  useEffect(() => {
    setMobileOpen(false);
  }, [router.pathname]);

  const theme = useTheme();

  return (
    <Root>
      <CssBaseline />
      <GlobalStyle />
      <Drawer>
        <Box sx={{ display: { xs: "block", lg: "none" } }}>
          <Sidebar
            PaperProps={{ style: { width: drawerWidth } }}
            variant="temporary"
            open={mobileOpen}
            onClose={handleDrawerToggle}
            items={dashboardItems}
          />
        </Box>
        <Box sx={{ display: { xs: "none", md: "block" } }}>
          <Sidebar
            PaperProps={{ style: { width: drawerWidth } }}
            items={dashboardItems}
          />
        </Box>
      </Drawer>
      <AppContent>
        <Navbar onDrawerToggle={handleDrawerToggle} />
        <MainContent
          sx={{
            [theme.breakpoints.up("lg")]: {
              padding: "0px 30px 30px 30px",
            },
            border: hasFile ? "2px dashed #5D9F97" : "none",
            padding: hasFile ? "1.5rem" : "0",
          }}
          {...getRootProps()}
        >
          <input {...getInputProps()} />
          {children}
          <Outlet />

          <ShowUploadProgress
            open={open}
            data={files}
            folderData={selectedFolderFiles}
            onDeleteData={handleDelete}
            onRemoveAll={handleRemoveAll}
            onClose={handleClose}
            onSelectMore={handleSelectMore}
            parentComponent="clientDashboard"
            hasNewFile={hasFile}
          />
        </MainContent>
        <Box
          sx={{
            position: "fixed",
            bottom: 30,
            right: 30,
            zIndex: 100,
          }}
        >
          <FloatingButton onSelectMore={handleSelectMore} />
        </Box>
      </AppContent>
    </Root>
  );
};

export default ClientDashboard;
