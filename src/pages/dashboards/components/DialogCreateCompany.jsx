import React, { useRef, useState } from "react";

// components
import DialogV1 from "../../../components/DialogV1";

// material ui
import AddIcon from "@mui/icons-material/Add";
import SaveIcon from "@mui/icons-material/Save";
import ClearIcon from "@mui/icons-material/Clear";
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { useMutation } from "@apollo/client";
import {
  MUTATION_CREATE_COMPANY,
  MUTATION_UPDATE_COMPANY,
} from "../company/apollo";
import { errorMessage, successMessage } from "../../../components/Alerts";
import { useTranslation } from "react-i18next";
import { Formik } from "formik";
import * as yup from "yup";
import { useEffect } from "react";
import { handleGraphqlErrors } from "../../../functions";

function DialogCreateCompany(props) {
  const { t } = useTranslation();
  const formikRef = useRef();
  const { data, isUpdate, onLoad, onClose } = props;
  const [dataForEvent, setDataForEvent] = useState({
    _id: "",
    name: "",
    email: "",
    phone: "",
    address: "",
    status: "",
  });

  const validationSchema = yup.object().shape({
    name: yup.string().required("Name is required"),
    email: yup
      .string()
      .required("Email is required")
      .email("Email must be valid email"),
    phone: yup.string().required("Phone is required"),
    address: yup.string().required("Address is required"),
  });
  // const [status, setStatus] = React.useState("active");
  // const [capitalLetter, setCapitalLetter] = React.useState("Active");

  const [createCompany] = useMutation(MUTATION_CREATE_COMPANY);
  const [updateCompany] = useMutation(MUTATION_UPDATE_COMPANY);

  const onSubmitFormData = async (values, { resetForm }) => {
    if (isUpdate) {
      try {
        let result = await updateCompany({
          variables: {
            id: dataForEvent?._id,
            input: {
              name: values.name,
              email: values.email,
              phone: values.phone,
              address: values.address,
              status: values.status,
            },
          },
        });
        if (result?.data?.updatePartner) {
          successMessage("Update success!", 2000);
          onLoad();
          onClose();
          resetForm();
        }
      } catch (error) {
        let cutErr = error.message.replace(/(ApolloError: )?Error: /, "");
        errorMessage(handleGraphqlErrors(cutErr), 3000);
      }
    } else {
      try {
        let result = await createCompany({
          variables: {
            input: {
              name: values.name,
              email: values.email,
              phone: values.phone,
              address: values.address,
              status: "active",
            },
          },
        });
        if (result?.data?.createPartner?._id) {
          successMessage("Create company success!", 2000);
          onLoad();
          onClose();
          resetForm();
        }
      } catch (error) {
        let cutErr = error.message.replace(/(ApolloError: )?Error: /, "");
        if (cutErr === "Duplicate entry") {
          errorMessage("This company has already exist!", 3000);
        } else {
          errorMessage("Something wrong! try again later", 3000);
        }
      }
    }
  };

  function handleCloseFormik() {
    formikRef.current?.resetForm();
    onClose();
  }

  useEffect(() => {
    setDataForEvent({
      ...data,
      name: data?.name || "",
      email: data?.email || "",
      phone: data?.phone || "",
      address: data?.address || "",
      status: data?.status || "",
    });
  }, [data]);

  return (
    <React.Fragment>
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
            padding: (theme) => `${theme.spacing(4)} ${theme.spacing(4)}`,
          },
        }}
        onClose={handleCloseFormik}
      >
        <h3 style={{ color: "#4B465C" }}>
          {isUpdate ? t("_update_company_title") : t("_create_company_title")}
        </h3>

        <Formik
          initialValues={dataForEvent}
          validationSchema={validationSchema}
          enableReinitialize={true}
          innerRef={formikRef}
          onSubmit={onSubmitFormData}
        >
          {({ values, errors, touched, handleChange, handleSubmit }) => (
            <form onSubmit={handleSubmit}>
              <InputLabel sx={{ color: "#A5A3AE", mt: 4 }}>
                {t("_name")}
              </InputLabel>
              <TextField
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
                name="name"
                placeholder={t("_name_placeholder")}
                size="small"
                InputLabelProps={{
                  shrink: false,
                }}
                error={Boolean(touched.name && errors.name)}
                helperText={touched.name && errors.name}
                onChange={handleChange}
                value={values.name}
              />
              <InputLabel sx={{ color: "#A5A3AE", mt: 4 }}>
                {t("_email")}
              </InputLabel>
              <TextField
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
                placeholder={t("_email_placeholder")}
                size="small"
                name="email"
                InputLabelProps={{
                  shrink: false,
                }}
                error={Boolean(touched.email && errors.email)}
                helperText={touched.email && errors.email}
                onChange={handleChange}
                value={values.email}
                // value={email}
                // onChange={(e) => setEmail(e.target.value)}
              />
              <InputLabel sx={{ color: "#A5A3AE", mt: 4 }}>
                {t("_phone")}
              </InputLabel>
              <TextField
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
                placeholder={t("_phone_placeholder")}
                size="small"
                name="phone"
                type="tel"
                InputLabelProps={{
                  shrink: false,
                }}
                error={Boolean(touched.phone && errors.phone)}
                helperText={touched.phone && errors.phone}
                onChange={handleChange}
                value={values.phone}
                // value={phone}
                // onChange={(e) => setPhone(e.target.value)}
              />
              {isUpdate ? (
                <>
                  <InputLabel sx={{ color: "#A5A3AE", mt: 4 }}>
                    {t("_status")}
                  </InputLabel>

                  <Box>
                    <FormControl fullWidth>
                      <Select
                        name="status"
                        onChange={handleChange}
                        size="small"
                        labelId="demo-select-small-label"
                        id="demo-select-small"
                        value={values.status}
                      >
                        <MenuItem value="active">Active</MenuItem>
                        <MenuItem value="inactive">Inactive</MenuItem>
                        <MenuItem value="blacklist">Blacklist</MenuItem>
                      </Select>
                    </FormControl>
                  </Box>
                  {/* <SelectV1
                    disableLabel
                    selectStyle={{
                      height: "35px",
                      minHeight: "35px",
                      marginRight: "0.5rem",
                      width: "100%",
                      color: "#989898",
                    }}
                    selectProps={{
                      disableClear: true,
                      onChange: handleSelectChange,
                      options: [
                        { label: "Active", value: "active" },
                        { label: "Inactive", value: "inactive" },
                        { label: "Blacklist", value: "blacklist" },
                      ],
                      defaultValue: [
                        {
                          label: capitalLetter,
                          value: status,
                        },
                      ],
                      sx: {
                        "& .MuiInputBase-root": {
                          height: "35px",
                        },
                      },
                    }}
                  /> */}
                </>
              ) : (
                ""
              )}

              <InputLabel sx={{ color: "#A5A3AE", mt: 4 }}>
                {t("_address")}
              </InputLabel>
              <TextField
                name="address"
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
                placeholder={t("_address_placeholder")}
                size="small"
                InputLabelProps={{
                  shrink: false,
                }}
                multiline
                rows={3}
                error={Boolean(touched.address && errors.address)}
                helperText={touched.address && errors.address}
                onChange={handleChange}
                value={values.address}
                // value={address}
                // onChange={(e) => setAddress(e.target.value)}
              />
              <Box sx={{ mt: 5 }}>
                <Button
                  variant="contained"
                  startIcon={<ClearIcon />}
                  color="error"
                  onClick={handleCloseFormik}
                >
                  {t("_cancel_button")}
                </Button>
                &nbsp; &nbsp;
                <Button
                  type="submit"
                  variant="contained"
                  startIcon={props?.isUpdate ? <SaveIcon /> : <AddIcon />}
                  // onClick={isUpdate ? handleUpdateCompany : handleCreateCompany}
                >
                  {props?.isUpdate ? t("_update_button") : t("_save_button")}
                </Button>
              </Box>
            </form>
          )}
        </Formik>
      </DialogV1>
    </React.Fragment>
  );
}

export default DialogCreateCompany;
