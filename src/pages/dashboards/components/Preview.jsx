import React from "react";

//mui component and style
import DialogV1 from "../../../components/DialogV1";

const Preview = (props) => {
  return (
    <DialogV1
      {...props}
      dialogProps={{
        PaperProps: {
          sx: {
            overflowY: "initial",
            width: "100%",
          },
        },
      }}
      dialogContentProps={{
        sx: {
          backgroundColor: "white !important",
          borderRadius: "6px",
          padding: (theme) => `${theme.spacing(8)} ${theme.spacing(6)}`,
        },
      }}
    >
      <img
        src={
          process.env.REACT_APP_BUNNY_PULL_ZONE +
          props.data?.newName +
          "-" +
          props.data?._id +
          "/" +
          process.env.REACT_APP_ZONE_PROFILE +
          "/" +
          props.data?.profile
        }
        alt="img"
        width="100%"
        height="auto"
      />
    </DialogV1>
  );
};

export default Preview;
