import React from "react";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";

function AppPagination() {
  return (
    <div>
      <Stack spacing={2}>
        <Pagination count={10} showFirstButton showLastButton />
      </Stack>
    </div>
  );
}

export default AppPagination;
