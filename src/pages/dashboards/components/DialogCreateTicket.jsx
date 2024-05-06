import { useMutation } from "@apollo/client";
import AddIcon from "@mui/icons-material/Add";
import SaveIcon from "@mui/icons-material/Save";
import { Box, Button, InputLabel, TextField } from "@mui/material";
import { styled as muiStyled } from "@mui/system";
import { Formik } from "formik";
import { Fragment } from "react";
import * as yup from "yup";
import DialogV1 from "../../../components/DialogV1";
import { CREATE_TICKET, UPDATE_TICKET } from "../ticket/apollo";

const DialogCreateTicket = (props) => {
  const { isUpdate } = props;
  const [createTicket] = useMutation(CREATE_TICKET);
  const [updateTicket] = useMutation(UPDATE_TICKET);

  const DialogPreview = muiStyled("div")(({ theme }) => ({
    width: "100%",
    display: "flex",
    flexDirection: "column",
  }));

  const dataSchema = {
    title: "",
    description: "",
  };

  const schemaValidation = yup.object({
    title: yup.string().trim().required("Title is required"),
    description: yup.string().trim().required("Description is required"),
  });

  const handleCreateTicket = (values) => {
    // update a ticket
    if (isUpdate) {
      // create a new ticket
    } else {
    }
  };

  return (
    <Fragment>
      <DialogV1
        {...props}
        dialogProps={{
          PaperProps: {
            sx: {
              overflowY: "initial",
              maxWidth: "500px",
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
        <Box>
          <h3>{isUpdate ? "Update Ticket" : "Create Ticket"}</h3>

          <DialogPreview>
            <Formik
              initialValues={dataSchema}
              validationSchema={schemaValidation}
              onSubmit={handleCreateTicket}
            >
              {({ erros, handleSubmit, touched, handleChange, values }) => (
                <form noValidate onSubmit={handleSubmit}>
                  <Box sx={{ mb: 3 }}>
                    <InputLabel htmlFor="labelTitle">Title</InputLabel>
                    <TextField
                      id="labelTitle"
                      placeholder="Enter Title"
                      name="title"
                      value={values.title}
                      error={Boolean(touched.title && erros?.title)}
                      helperText={touched.title && erros?.title}
                      onChange={handleChange}
                      sx={{
                        width: "100%",
                        marginTop: 1,
                        "& .MuiInputBase-root": {
                          input: {
                            "&::placeholder": {
                              opacity: 1,
                            },
                          },
                        },
                      }}
                      size="small"
                      InputLabelProps={{ shrink: false }}
                      multiline={true}
                    />
                  </Box>

                  <Box>
                    <InputLabel htmlFor="labelDescription">
                      Description
                    </InputLabel>
                    <TextField
                      id="labelDescription"
                      placeholder="Enter Description"
                      name="description"
                      onChange={handleChange}
                      error={Boolean(
                        touched?.description && erros?.description
                      )}
                      helperText={touched?.description && erros?.description}
                      sx={{
                        width: "100%",
                        marginTop: 1,
                        "& .MuiInputBase-root": {
                          input: {
                            "&::placeholder": {
                              opacity: 1,
                            },
                          },
                        },
                      }}
                      size="small"
                      InputLabelProps={{ shrink: false }}
                      multiline={true}
                    />
                  </Box>
                  <Box sx={{ mt: 5 }}>
                    <Button
                      type="submit"
                      variant="contained"
                      startIcon={props?.isUpdate ? <SaveIcon /> : <AddIcon />}
                    >
                      {props?.isUpdate ? "Update" : "Create"}
                    </Button>
                  </Box>
                </form>
              )}
            </Formik>
          </DialogPreview>
        </Box>
      </DialogV1>
    </Fragment>
  );
};

export default DialogCreateTicket;
