import React from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";

function Myfolder({ ...props }) {
  return (
    <div>
      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={5}>
          {props.children}
        </Grid>
      </Box>
    </div>
  );
}

export default Myfolder;
