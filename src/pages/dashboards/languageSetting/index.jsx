import { Paper, CardHeader, Card } from "@mui/material";
import React from "react";

function LanguageSetting() {
  return (
    <Paper
      sx={{
        mt: (theme) => theme.spacing(3),
        flex: "1 1 0",
      }}
    >
      <Card>
        <CardHeader title="Language Setting" subheader="No one stop me" />
      </Card>
    </Paper>
  );
}

export default LanguageSetting;
