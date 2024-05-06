import { Card, CardContent, CardMedia, Typography } from "@mui/material";
import DialogV1 from "../../../components/DialogV1";
import { previewImage } from "../../../functions";
import { Editor } from "@tinymce/tinymce-react";

function DialogDetails(props) {
  return (
    <div>
      <DialogV1
        {...props}
        dialogProps={{
          PaperProps: {
            sx: {
              overflowY: "initial",
              maxWidth: "sm",
            },
          },
          sx: {
            columnGap: "20px",
          },
        }}
        dialogContentProps={{
          sx: {
            backgroundColor: "white !important",
            borderRadius: "6px",
            padding: (theme) => `${theme.spacing(5)}`,
          },
        }}
      >
        <Card>
          <CardContent
            sx={{
              display: "flex",
              flexDirection: "column",
              rowGap: "6px",
              "& .tox-statusbar__branding": {
                display: "none",
              },
              "&.tox-statusbar__branding svg": {
                display: "none",
              },
              "& .tox .tox-statusbar": {
                display: "none",
                border: "none",
              },
              "& .tox-tinymce": {
                border: "none",
              },
            }}
          >
            <Typography sx={{ mb: 5 }} variant="h6">
              {props.data.announcementId?.title}
            </Typography>
            {props.data.announcementId?.image ? (
              <CardMedia
                component="img"
                height="auto"
                image={`${previewImage}${props.data.announcementId?.image}`}
                alt={props.data.announcementId?.image}
              />
            ) : (
              <Editor
                apiKey={process.env.REACT_APP_TINYMCE_API}
                initialValue={props.data.announcementId?.content}
                disabled={true}
                init={{
                  menubar: false,
                  toolbar: false,
                  readonly: true,
                  plugins: ["autoresize"],
                }}
              />
            )}
          </CardContent>
        </Card>
      </DialogV1>
    </div>
  );
}

export default DialogDetails;
