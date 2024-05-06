import { Grid, MenuItem } from "@mui/material";
import React from "react";
import OptionsStatistics from "./authentication/menu/optionsStatistics";
import SelectdSection from "./SelectedSection";

function Sections(props) {
  const { dispatch, selectedValue } = props;
  const menuOptions = OptionsStatistics();

  return (
    <div>
      <Grid item>
        <SelectdSection
          value={selectedValue}
          label="Weekly"
          variant="outlined"
          onChange={dispatch}
        >
          {menuOptions?.map((menu, index) => {
            return (
              <MenuItem key={index} value={menu?.value}>
                {menu?.label}
              </MenuItem>
            );
          })}
        </SelectdSection>
      </Grid>
    </div>
  );
}

export default Sections;
