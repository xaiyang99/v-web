import { Box, InputAdornment, TextField, useMediaQuery } from "@mui/material";

import { styled } from "@mui/material/styles";
import React from "react";
import NormalButton from "../../../../../components/NormalButton";
import PaginationStyled from "../../../../../components/PaginationStyled";
import useFirstRender from "../../../../../hooks/useFirstRender";
import * as Icon from "../../icons";
import MostDownloadDataGrid from "./MostDownloadDataGrid";

const MostDownloadContainer = styled("div")(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  backgroundColor: theme.palette.mode === "dark" ? "#fff" : "#fff",
  ...theme.typography.body2,
  textAlign: "left",
  color: theme.palette.text.secondary,
  borderRadius: "8px",
  boxShadow: "rgba(0, 0, 0, 0.09) 0px 3px 12px",
  height: "100%",
  minHeight: "500px",
}));

const MostDownload = (props) => {
  const isMobile = useMediaQuery("(max-width:768px)");
  const isFirstRender = useFirstRender();
  const [searchValue, setSearchValue] = React.useState("");
  const searchBarRef = React.useRef(null);

  React.useEffect(() => {
    if (!isFirstRender) {
      if (!searchValue) {
        props.onSearch("");
      }
    }
  }, [searchValue]);

  return (
    <MostDownloadContainer>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: (theme) => theme.spacing(5),
        }}
      >
        <Box
          sx={{
            typography: isMobile ? "p" : "h4",
            fontWeight: 600,
          }}
        >
          Most Download
        </Box>
        <Box>
          <TextField
            inputRef={searchBarRef}
            onChange={(e) => {
              setSearchValue(e.target.value);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                props.onSearch(searchValue);
                // searchBarRef.current.blur();
              }
            }}
            placeholder="Search"
            size="small"
            InputLabelProps={{
              shrink: false,
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <NormalButton
                    onClick={() => props.onSearch(searchValue)}
                    sx={{
                      color: "#7F7F7F",
                      width: "initial",
                      height: "initial",
                    }}
                  >
                    <Icon.FaSearchIcon />
                  </NormalButton>
                </InputAdornment>
              ),
            }}
          />
        </Box>
      </Box>
      <Box
        sx={{
          flex: "1 1 0%",
        }}
      >
        <MostDownloadDataGrid data={props.data} />
      </Box>
      <Box
        sx={{
          ...(isMobile && {
            "&": {
              fontSize: "0.7rem",
            },
          }),
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: (theme) => theme.spacing(5),
        }}
      >
        <Box sx={{}}>
          Showing 1 to 5 of{" "}
          {props.data.length > 1
            ? `${props.total} entries`
            : `${props.total || 0} entry`}
        </Box>
        <Box>
          <PaginationStyled
            currentPage={props.pagination.currentPage}
            total={props.pagination.total}
            setCurrentPage={props.pagination.setCurrentPage}
          />
        </Box>
      </Box>
    </MostDownloadContainer>
  );
};

export default MostDownload;
