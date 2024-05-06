import { useLazyQuery } from "@apollo/client";
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { Fragment, useEffect, useState } from "react";
import { DateFormat, getDateFormate } from "../../../../functions";
import useAuth from "../../../../hooks/useAuth";
import * as MUI from "../../css/accountStyle";
import { QUERY_LOG } from "../apollo";
import {
  BraveBrowser,
  ChromeBrowser,
  DuckgoBrowser,
  EdgeBrowser,
  FireFoxBrowser,
  OperaBrowser,
  SafariBrowser,
  VivalidBrowser,
} from "./icon";

const Icons = [
  {
    icon: <EdgeBrowser />,
    title: "Edge",
  },
  {
    icon: <ChromeBrowser />,
    title: "Chrome",
  },
  {
    icon: <FireFoxBrowser />,
    title: "Firefox",
  },
  {
    icon: <OperaBrowser />,
    title: "Opera",
  },
  {
    icon: <SafariBrowser />,
    title: "Safari",
  },
  {
    icon: <BraveBrowser />,
    title: "Brave",
  },
  {
    icon: <VivalidBrowser />,
    title: "Vivaldi",
  },
  {
    icon: <DuckgoBrowser />,
    title: "DuckDuckGo",
  },
];

function Index() {
  const { user } = useAuth();
  const isMobile = useMediaQuery("(max-width:600px)");
  const [loginLog, setLoginLog] = useState([]);
  const [dataLoggedIn] = useLazyQuery(QUERY_LOG, {
    fetchPolicy: "no-cache",
  });

  function convertLoggedDescription(data) {
    const cleanedStr = data.replace(/\\/g, "");
    const normalStr = JSON.parse(cleanedStr);

    return normalStr;
  }

  function filterUniqueBrowsers(dataArrays) {
    const uniqueArrays = [];

    return dataArrays.filter((item) => {
      let browser = convertLoggedDescription(item?.description)?.browser;
      if (uniqueArrays.indexOf(browser) === -1) {
        uniqueArrays.push(browser);
        return true;
      }

      return false;
    });
  }

  useEffect(() => {
    const getDataLoggedIn = async () => {
      try {
        const res = await dataLoggedIn({
          variables: {
            where: {
              createdBy: user?._id,
              name: "login",
            },
            orderBy: "createdAt_DESC",
            limit: 10,
          },
        });

        const data = (await res.data?.getLogs?.data) || [];
        const rows = filterUniqueBrowsers(data);
        if (rows?.length) {
          setLoginLog(rows);
        }
      } catch (error) {
        console.log(error);
      }
    };

    getDataLoggedIn();
  }, []);

  /* useEffect(() => {
    const getOldLogged = () => {
      const axios = require("axios");
      let data = "";
      let name = "login";
      let config = {
        method: "get",
        maxBodyLength: Infinity,
        url: `${createLog_api}?name=${name}&createdBy=${user?._id}&limit=${5}`,
        headers: {},
        data: data,
      };

      axios
        .request(config)
        .then((response) => {
          setLoginLog(response.data);
        })
        .catch((error) => {
          errorMessage(error, 3000);
        });
    };
  }, []); */

  return (
    <MUI.PaperGlobal sx={{ marginTop: "2rem" }}>
      <Typography
        variant="h6"
        sx={{ color: "#5D596C", fontWeight: isMobile ? "500" : "600" }}
      >
        Logined Devices
      </Typography>
      <Box sx={{ marginTop: "1rem" }}>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="caption table">
            <TableHead>
              <MUI.RowTableRow>
                <MUI.CellTableCell>NO</MUI.CellTableCell>
                <MUI.CellTableCell>BROWSER</MUI.CellTableCell>
                <MUI.CellTableCell>DEVICE</MUI.CellTableCell>
                <MUI.CellTableCell>LOCATION</MUI.CellTableCell>
                <MUI.CellTableCell>RECENT ACTIVITIES</MUI.CellTableCell>
              </MUI.RowTableRow>
            </TableHead>

            {loginLog?.length > 0 && (
              <TableBody>
                {loginLog?.map((row, index) => {
                  return (
                    <MUI.RowTableRow key={index}>
                      <MUI.CellTableCell>{index + 1}</MUI.CellTableCell>
                      <MUI.CellTableCell
                        component="th"
                        sx={{
                          display: "flex",
                          textAlign: "center",
                          justifyContent: "start",
                        }}
                      >
                        {Icons.map((icon, index) => (
                          <Fragment key={index}>
                            {icon.title ===
                            convertLoggedDescription(row?.description)?.browser
                              ? icon.icon
                              : ""}
                          </Fragment>
                        ))}
                        &nbsp;{" "}
                        {convertLoggedDescription(row?.description)?.browser}
                      </MUI.CellTableCell>
                      <MUI.CellTableCell>
                        {convertLoggedDescription(row?.description)?.os || "--"}
                      </MUI.CellTableCell>
                      <MUI.CellTableCell>
                        {"--"}
                        {/* {convertLoggedDescription(row?.description)?.from ||
                          "--"} */}
                      </MUI.CellTableCell>
                      <MUI.CellTableCell>
                        {/* {DateFormat(row?.createdAt)} */}
                        {getDateFormate(row?.createdAt)}
                      </MUI.CellTableCell>
                    </MUI.RowTableRow>
                  );
                })}
              </TableBody>
            )}
          </Table>
        </TableContainer>
      </Box>
    </MUI.PaperGlobal>
  );
}

export default Index;
