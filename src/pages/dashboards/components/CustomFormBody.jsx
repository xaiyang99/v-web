import { Box, Typography } from "@mui/material";
import moment from "moment";
import React, { useEffect } from "react";
import InputCreditCardField from "../../../components/InputCreditCardField";
import InputTextField from "../../../components/InputTextField";
import TextareaAuto from "../../../components/TextAreaField";
import TextEditor from "../../../components/TextEditor";
import TextRadio from "../../../components/TextRadio";
import { capitalizeFirstLetter } from "../../../functions";
import DatePickerV1 from "./DatePickerV1";
import InputImageField from "./InputImageField";
import SelectV1 from "./SelectV1";

const CustomFormBody = ({ formik, ...props }) => {
  useEffect(() => {
    return () => {
      formik.resetForm();
    };
  }, []);
  return (
    <>
      {props.formFields?.map((field, index) => {
        let input = null;
        switch (field.type) {
          case "text":
          case "number":
          case "password":
          case "credit_card_exp_date":
          case "credit_card_cvv_code":
            input = (
              <InputTextField
                disabled={field.value && field.disabled}
                label={field.label}
                inputLayoutProps={{
                  sx: { height: "35px", minHeight: "35px" },
                }}
                {...{
                  ...(field.type === "credit_card_exp_date" && {
                    isCreditCardExpDate: true,
                  }),
                  ...(field.type === "credit_card_cvv_code" && {
                    isCreditCardCVVCode: true,
                  }),
                }}
                inputProps={{
                  ...(field.readOnly && {
                    InputProps: {
                      readOnly: true,
                    },
                  }),
                  type: field.type,
                  id: field.name,
                  name: field.name,
                  value: field.value || "",
                  onChange: formik.handleChange,
                  placeholder: field.placeholder || field.label,
                  disabled: field.disabled,
                }}
              />
            );
            break;
          case "credit_card_number":
            input = (
              <InputCreditCardField
                label={field.label}
                inputLayoutProps={{
                  sx: { height: "35px", minHeight: "35px" },
                }}
                inputProps={{
                  type: field.type,
                  id: field.name,
                  name: field.name,
                  value: field.value,
                  onChange: formik.handleChange,
                  placeholder: field.placeholder || field.label,
                }}
              />
            );
            break;
          case "select":
            input = (
              <SelectV1
                selectStyle={{
                  height: "35px",
                  minHeight: "35px",
                }}
                label={field.label}
                selectProps={{
                  disableClear: field.disableClear || false,
                  id: field.name,
                  name: field.name,
                  onChange: (e) => {
                    formik.setFieldValue(field.name, e?.value || "");
                  },
                  defaultValue: field.value,
                  menuPortalTarget: document.body,
                  options: field.options,
                  placeholder: field.placeholder || field.label,
                  ...(field.readOnly && {
                    isSearchable: false,
                    menuIsOpen: false,
                  }),
                }}
              />
            );
            break;
          case "date":
            input = (
              <DatePickerV1
                label={field.label}
                placeholder="dd/mm/yyyy"
                datePickerProps={{
                  id: field.name,
                  name: field.name,
                  value: field.value || null,
                  onChange: (e) => {
                    formik.setFieldValue(
                      field.name,
                      e ? moment(e).utc(true).toDate() : null,
                    );
                  },
                  sx: {
                    "& .MuiInputBase-root": {
                      height: "35px",
                    },
                  },
                }}
              />
            );
            break;
          case "image":
            input = (
              <InputImageField
                canDeleteImage={field.canDeleteImage}
                onDeleteImageChange={(value) => {
                  formik.setFieldValue(
                    `isDelete${capitalizeFirstLetter(field.name)}Image`,
                    value,
                  );
                }}
                fileData={formik.values?.[`${field.name}Image`]}
                label={field.label}
                inputLayoutProps={{
                  sx: {
                    height: "35px",
                    minHeight: "35px",
                  },
                }}
                imageData={{
                  ...field.imageData,
                }}
                inputProps={{
                  id: field.name,
                  name: field.name,
                  value: "",
                  onChange: (e) => {
                    formik.setFieldValue(
                      `${field.name}Image`,
                      e.target.files?.[0],
                    );
                    formik.handleChange(e);
                  },
                }}
                onRemove={() => {
                  formik.setFieldValue(`${field.name}Image`, {});
                  formik.setFieldValue(`${field.name}`, "");
                }}
                {...(field?.inputImage && {
                  inputImageProps: field?.inputImage,
                })}
              />
            );
            break;
          case "textEditor":
            input = (
              <TextEditor
                label={field.label}
                value={field.value}
                name={field.name}
                editorRef={field.value}
              />
            );
            break;
          case "textAreaField":
            input = (
              <TextareaAuto
                readOnly={field.readOnly}
                label={field.label}
                value={field.value}
                name={field.name}
                onChange={formik.handleChange}
                placeholder={field.placeholder || field.label}
                {...(field.customStyles || {})}
              />
            );
            break;
          case "radio":
            input = (
              <TextRadio
                radioProps={{
                  id: field.name,
                  name: field.name,
                  onChange: (e) => {
                    formik.setFieldValue(field.name, e?.value || "");
                  },
                  defaultValue: field.value,
                  options: field.options,
                }}
              />
            );
            break;
          default:
            input = null;
        }

        return (
          <React.Fragment key={index}>
            {field.type !== "hidden" && (
              <Box gridColumn={field.gridColumn || "span 6"}>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  {input}
                  {formik.touched?.[field.name] &&
                    (formik.errors?.[field.name] ||
                      formik.errors?.[`${field.name}Image`]) && (
                      <Typography component="div" padding={1} color={"#EA5455"}>
                        {formik.errors?.[field.name] ||
                          formik.errors?.[`${field.name}Image`]}
                      </Typography>
                    )}
                </Box>
              </Box>
            )}
          </React.Fragment>
        );
      })}
    </>
  );
};

export default CustomFormBody;
