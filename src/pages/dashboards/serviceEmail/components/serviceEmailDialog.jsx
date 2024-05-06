import React, { useEffect, useRef, useState } from "react";
import DialogV1 from "../../../../components/DialogV1";
import { Formik } from "formik";
import * as yup from "yup";
import {
  Box,
  Button,
  FormControl,
  MenuItem,
  Select,
  TextField,
  Typography,
  styled,
  useMediaQuery,
} from "@mui/material";
import { errorMessage, successMessage } from "../../../../components/Alerts";
import { useMutation } from "@apollo/client";
import { CREATE_SERVICE_EMAIL, UPDATE_SERVICE_EMAIL } from "../apollo";
import { Editor } from "@tinymce/tinymce-react";

const TextLabel = styled("label")({
  display: "block",
  marginBottom: "5px",
  fontSize: "14px",
  fontWeight: 400,
  color: "#333333",
});

const InputContainer = styled("div")({
  display: "flex",
  flexDirection: "column",
  marginBottom: "14px",
});

const BoxCenter = styled("div")({
  display: "flex",
  justifyContent: "center",
});

function ServiceEmailDialog(props) {
  const { dataValue, isUpdate, onClose, onConfirm } = props;
  const formikRef = useRef();
  const editorRef = useRef();
  const [content, setContent] = useState("");
  const isMobile = useMediaQuery("(max-width:600px)");
  const [createEmail] = useMutation(CREATE_SERVICE_EMAIL);
  const [updateEmail] = useMutation(UPDATE_SERVICE_EMAIL);

  const [dataForEvents, setDataForEvents] = useState({
    name: "",
    email: "",
    template: "",
    type: "",
    status: "",
  });

  const schemaValidate = yup.object().shape({
    name: yup.string().required("Name is required"),
    email: yup.string().required("Email is required").email("Email is invalid"),
    type: yup.string().required("Type is required"),
  });

  async function handleSave(values) {
    if (isUpdate) {
      try {
        const result = await updateEmail({
          variables: {
            id: dataValue?._id,
            input: {
              name: values.name,
              email: values.email,
              template: editorRef.current.getContent(),
              type: values.type,
              status: values.status,
            },
          },
        });
        if (result.data?.updateEmail?._id) {
          editorRef.current?.setContent("");
          successMessage("Update success!", 2000);
          onConfirm();
          handleClose();
        }
      } catch (error) {
        errorMessage("Something went wrong. Please try again", 3000);
      }
    } else {
      try {
        const result = await createEmail({
          variables: {
            input: {
              name: values.name,
              email: values.email,
              template: editorRef.current.getContent(),
              type: values.type,
            },
          },
        });

        if (result.data?.createEmail?._id) {
          editorRef.current?.setContent("");
          successMessage("The email was created successfully", 2000);
          onConfirm();
          handleClose();
        }
      } catch (error) {
        errorMessage("Something went wrong. Please try again", 3000);
      }
    }
  }

  function handleClose() {
    formikRef.current?.resetForm();
    setContent("");
    setDataForEvents({
      name: "",
      email: "",
      template: "",
      type: "",
      status: "",
    });
    onClose();
  }

  useEffect(() => {
    if (isUpdate) {
      editorRef.current?.setContent(dataValue?.template);
      setContent(dataValue?.template);
      setDataForEvents({
        ...dataValue,
      });
    }
  }, [dataValue, isUpdate]);

  return (
    <DialogV1
      {...props}
      dialogProps={{
        PaperProps: {
          sx: {
            overflowY: "initial",
            maxWidth: "650px",
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
      onClose={handleClose}
    >
      <Box>
        <Box sx={{ my: 2, mb: 4 }}>
          <BoxCenter>
            <Typography variant="h3">
              {isUpdate ? "Update Email" : "Create Email"}
            </Typography>
          </BoxCenter>

          <BoxCenter sx={{ mt: 3 }}>
            <Typography component="span">
              {isUpdate ? "Update email" : "Create email"} details will receive
              a privacy audit
            </Typography>
          </BoxCenter>
        </Box>

        <Formik
          initialValues={dataForEvents}
          validationSchema={schemaValidate}
          enableReinitialize={true}
          innerRef={formikRef}
          onSubmit={handleSave}
        >
          {({ values, touched, errors, handleChange, handleSubmit }) => {
            return (
              <form onSubmit={handleSubmit}>
                <InputContainer>
                  <TextLabel>Name</TextLabel>
                  <TextField
                    name="name"
                    type="text"
                    placeholder="Name"
                    size="small"
                    fullWidth={true}
                    error={Boolean(touched.name && errors.name)}
                    helperText={touched.name && errors.name}
                    onChange={handleChange}
                    value={values.name}
                  />
                </InputContainer>

                <InputContainer>
                  <TextLabel>Email</TextLabel>
                  <TextField
                    name="email"
                    type="email"
                    placeholder="Email address"
                    size="small"
                    fullWidth={true}
                    error={Boolean(touched.email && errors.email)}
                    helperText={touched.email && errors.email}
                    onChange={handleChange}
                    value={values.email}
                  />
                </InputContainer>

                <FormControl sx={{ mb: 4 }} fullWidth={true}>
                  <TextLabel>Type</TextLabel>
                  <Select
                    id="label-type"
                    size="small"
                    name="type"
                    error={Boolean(touched.type && errors.type)}
                    fullWidth={true}
                    onChange={handleChange}
                    value={values.type}
                  >
                    <MenuItem value="">
                      <em>None</em>
                    </MenuItem>
                    <MenuItem value="sender">Sender</MenuItem>
                    <MenuItem value="verify">Verify</MenuItem>
                    <MenuItem value="support">Support</MenuItem>
                  </Select>
                </FormControl>

                {isUpdate && (
                  <FormControl sx={{ mb: 4 }} fullWidth={true}>
                    <TextLabel>Status</TextLabel>
                    <Select
                      id="label-type"
                      size="small"
                      name="status"
                      fullWidth={true}
                      onChange={handleChange}
                      displayEmpty={true}
                      renderValue={
                        values.status !== "" ? undefined : () => "Select status"
                      }
                      value={values.status}
                    >
                      <MenuItem value="">
                        <em>None</em>
                      </MenuItem>
                      <MenuItem value="active">Active</MenuItem>
                      <MenuItem value="inactive">Inactive</MenuItem>
                    </Select>
                  </FormControl>
                )}

                <InputContainer>
                  <TextLabel>Template</TextLabel>
                  <Editor
                    ref={editorRef}
                    apiKey={process.env.REACT_APP_TINYMCE_API}
                    initialValue={content}
                    onInit={(evt, editor) => {
                      editorRef.current = editor;
                    }}
                    init={{
                      height: isMobile ? 200 : 500,
                      menubar: false,
                      selector: "textarea",
                      plugins: [
                        "advlist",
                        "autolink",
                        "lists",
                        "link",
                        "image",
                        "charmap",
                        "preview",
                        "anchor",
                        "searchreplace",
                        "visualblocks",
                        "autoresize",
                      ],
                      toolbar:
                        "insertfile undo redo | blocks | bold italic forecolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent image",
                      content_style:
                        "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
                      image_uploadtab: true,
                      file_picker_callback: function (callback) {
                        const input = document.createElement("input");
                        input.type = "file";
                        input.accept = "image/*";
                        input.onchange = function () {
                          if (input.files.length > 0) {
                            const file = input.files[0];
                            const reader = new FileReader();
                            reader.onload = function () {
                              callback(reader.result, { title: file.name });
                            };
                            reader.readAsDataURL(file);
                          }
                        };
                        input.click();
                      },
                    }}
                  />
                </InputContainer>

                <Box
                  sx={{
                    mt: 6,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "16px",
                  }}
                >
                  <Button type="submit" variant="contained" color="primary">
                    Save
                  </Button>
                  <Button
                    type="button"
                    variant="contained"
                    sx={{
                      padding: (theme) =>
                        `${theme.spacing(2)} ${theme.spacing(4)}`,
                      borderRadius: (theme) => theme.spacing(1),
                      backgroundColor: "rgba(0,0,0,0.1)",
                      color: "rgba(0,0,0,0.5)",
                      "&:hover": {
                        backgroundColor: "rgba(0,0,0,0.1)",
                      },
                    }}
                    onClick={handleClose}
                  >
                    Cancel
                  </Button>
                </Box>
              </form>
            );
          }}
        </Formik>
      </Box>
    </DialogV1>
  );
}

export default ServiceEmailDialog;
