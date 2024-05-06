import { Box, IconButton, Tooltip, useMediaQuery } from "@mui/material";
import { useEffect } from "react";
import { CgMenuGridO } from "react-icons/cg";
import { IoIosList } from "react-icons/io";
import * as MUI from "./../css/folderStyle";

function SwitchPages(props) {
  const { handleToggle, toggle, setToggle } = props;
  const isMobile = useMediaQuery("(max-width:600px)");
  useEffect(() => {
    const fetch = async () => {
      const result = localStorage.getItem("toggle");
      if (result !== "") {
        setToggle(result);
      } else {
        localStorage.setItem("toggle", "list");
      }
    };
    fetch();
  }, [toggle]);

  return (
    <MUI.SwitchPage>
      {isMobile ? (
        <Box>
          {toggle === "grid" && (
            <IconButton onClick={() => handleToggle("list")}>
              <IoIosList style={{ color: "black" }} />
            </IconButton>
          )}
          {toggle === "list" && (
            <IconButton onClick={() => handleToggle("grid")}>
              <CgMenuGridO style={{ color: "black" }} />
            </IconButton>
          )}
        </Box>
      ) : (
        <Box>
          <Tooltip title="Show List">
            <IconButton onClick={() => handleToggle("list")}>
              {toggle === "list" ? (
                <IoIosList style={{ color: "black" }} />
              ) : (
                <IoIosList style={{ color: "grey" }} />
              )}
            </IconButton>
          </Tooltip>
          <Tooltip title="Show Grid">
            {toggle === "grid" ? (
              <IconButton onClick={() => handleToggle("grid")}>
                <CgMenuGridO style={{ color: "black" }} />
              </IconButton>
            ) : (
              <IconButton onClick={() => handleToggle("grid")}>
                <CgMenuGridO style={{ color: "grey" }} />
              </IconButton>
            )}
          </Tooltip>
        </Box>
      )}
    </MUI.SwitchPage>
  );
}

export default SwitchPages;
