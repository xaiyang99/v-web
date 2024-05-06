import React from "react";
import CircularProgress from "@mui/material/CircularProgress";
import { Box, Dialog, styled } from "@mui/material";

const ContainerReloading = styled(Box)({
  background: "#cbcbcb",
  overflow: "hidden",
});
function Reload(props) {
  const { isOpen, onClose } = props;
  return (
    <div>
      <Dialog open={isOpen} onClose={onClose} sx={{ zIndex: 999999999999 }}>
        <ContainerReloading>
          <CircularProgress />
        </ContainerReloading>
      </Dialog>
    </div>
  );
}

export default Reload;
