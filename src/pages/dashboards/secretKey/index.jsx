import React, { Fragment, useEffect } from "react";
import BreadcrumbNavigate from "../../../components/BreadcrumbNavigate";
import * as MUI from "../css/settingStyle";
import { Paper, TextField, Typography } from "@mui/material";
import * as Icon from "../../../icons/icons";
import { useTranslation } from "react-i18next";
import useSecretEncrypted from "./hooks/useSecretEncrypt";
import * as yup from "yup";
import { Formik } from "formik";
import { useState } from "react";
import { LoadingButton } from "@mui/lab";
import { errorMessage, successMessage } from "../../../components/Alerts";
import { handleGraphqlErrors } from "../../../functions";
import { MUTATION_UPDATE_SETTING } from "../settings/apollo";
import { useMutation } from "@apollo/client";

function SecretKey() {
  const { t } = useTranslation();
  const useDataEncryption = useSecretEncrypted();
  const [updateSetting] = useMutation(MUTATION_UPDATE_SETTING);
  const [isLoading, setIsLoading] = useState(false);

  const [dataForEvent, setDataForEvent] = useState({
    bunnyKey: "",
    hostBunny: "",
    publicStrip: "",
    secretStrip: "",
  });
  const validateSchema = yup.object().shape({
    bunnyKey: yup.string().required("Bunny key is required"),
    hostBunny: yup.string().required("Host bunny is required"),
    publicStrip: yup.string().required("Public strip is required"),
    secretStrip: yup.string().required("Secret strip is required"),
  });

  const settingKeys = {
    bunnyKey: "sckfbn",
    hostBunny: "hbnsck",
    publicStrip: "stkehp",
    secretStrip: "kpwjen",
  };

  function handleDataEncryption(key) {
    const value = useDataEncryption.data?.find(
      (item) => item.productKey === key,
    );
    if (value) {
      return value;
    }

    return null;
  }

  async function handleSubmitForm(values) {
    const dataUpdates = [
      {
        key: settingKeys.bunnyKey,
        value: values.bunnyKey,
      },
      {
        key: settingKeys.hostBunny,
        value: values.hostBunny,
      },
      {
        key: settingKeys.publicStrip,
        value: values.publicStrip,
      },
      {
        key: settingKeys.secretStrip,
        value: values.secretStrip,
      },
    ];

    setIsLoading(true);
    try {
      for (let index = 0; index < dataUpdates.length; index++) {
        await updateSetting({
          variables: {
            data: {
              action: dataUpdates[index].value,
            },
            where: {
              productKey: dataUpdates[index].key,
            },
          },
        });
      }
      setIsLoading(false);
      successMessage("Update setting successfully", 3000);
    } catch (error) {
      setIsLoading(false);
      let cutErr = error.message?.replace(/(ApolloError: )?Error: /, "");
      errorMessage(handleGraphqlErrors(cutErr), 3000);
    }
  }

  useEffect(() => {
    const dataBunny = handleDataEncryption(settingKeys.bunnyKey);
    setDataForEvent((prevState) => {
      return { ...prevState, bunnyKey: dataBunny?.action || "" };
    });

    const dataHost = handleDataEncryption(settingKeys.hostBunny);
    setDataForEvent((prevState) => {
      return { ...prevState, hostBunny: dataHost?.action || "" };
    });

    const dataPublicStrip = handleDataEncryption(settingKeys.publicStrip);
    setDataForEvent((prevState) => {
      return { ...prevState, publicStrip: dataPublicStrip?.action || "" };
    });

    const dataSecretStrip = handleDataEncryption(settingKeys.secretStrip);
    setDataForEvent((prevState) => {
      return { ...prevState, secretStrip: dataSecretStrip?.action || "" };
    });
  }, [useDataEncryption.data]);

  return (
    <Fragment>
      <BreadcrumbNavigate
        separatorIcon={<Icon.ForeSlash />}
        title="Setting"
        path={["Setting"]}
        readablePath={[t("_setting"), t("_general_setting")]}
      />

      <MUI.SettingContainer>
        <Paper
          sx={{
            mt: (theme) => theme.spacing(3),
            boxShadow: (theme) => theme.baseShadow.secondary,
            flex: "1 1 0",
          }}
        >
          <MUI.SettingWrapperContainer>
            <Formik
              validationSchema={validateSchema}
              initialValues={dataForEvent}
              enableReinitialize={true}
              onSubmit={handleSubmitForm}
            >
              {({ values, errors, touched, handleChange, handleSubmit }) => (
                <form onSubmit={handleSubmit}>
                  {/* Secret key for bunny */}
                  <MUI.SettingHeaderContainer>
                    <Typography variant="h2">
                      Secret key for encrypted access key bunny
                    </Typography>
                    <TextField
                      name="bunnyKey"
                      placeholder="Secrey bunny key"
                      size="small"
                      fullWidth={true}
                      error={Boolean(touched.bunnyKey && errors.bunnyKey)}
                      helperText={touched.bunnyKey && errors.bunnyKey}
                      onChange={handleChange}
                      value={values.bunnyKey}
                    />
                  </MUI.SettingHeaderContainer>

                  {/* Secret key for host bunny */}
                  <MUI.SettingHeaderContainer>
                    <Typography variant="h2">
                      Secret key for encrypted host bunny
                    </Typography>
                    <TextField
                      name="hostBunny"
                      placeholder="Secrey bunny key"
                      size="small"
                      fullWidth={true}
                      error={Boolean(touched.hostBunny && errors.hostBunny)}
                      helperText={touched.hostBunny && errors.hostBunny}
                      onChange={handleChange}
                      value={values.hostBunny}
                    />
                  </MUI.SettingHeaderContainer>

                  {/* Secret key for strip public */}
                  <MUI.SettingHeaderContainer>
                    <Typography variant="h2">
                      Secret key for encrypted host bunny
                    </Typography>
                    <TextField
                      name="publicStrip"
                      placeholder="Public bunny"
                      size="small"
                      fullWidth={true}
                      error={Boolean(touched.publicStrip && errors.publicStrip)}
                      helperText={touched.publicStrip && errors.publicStrip}
                      onChange={handleChange}
                      value={values.publicStrip}
                    />
                  </MUI.SettingHeaderContainer>

                  {/* Secret key for stripe secret */}
                  <MUI.SettingHeaderContainer>
                    <Typography variant="h2">
                      Secret key for encrypted host bunny
                    </Typography>
                    <TextField
                      name="secretStrip"
                      placeholder="Secret strip"
                      size="small"
                      fullWidth={true}
                      error={Boolean(touched.secretStrip && errors.secretStrip)}
                      helperText={touched.secretStrip && errors.secretStrip}
                      onChange={handleChange}
                      value={values.secretStrip}
                    />
                  </MUI.SettingHeaderContainer>

                  <MUI.SettingLineAction></MUI.SettingLineAction>

                  <MUI.SettingAction>
                    <LoadingButton
                      type="submit"
                      variant="contained"
                      loading={isLoading}
                    >
                      Save data
                    </LoadingButton>
                  </MUI.SettingAction>
                </form>
              )}
            </Formik>
          </MUI.SettingWrapperContainer>
        </Paper>
      </MUI.SettingContainer>
    </Fragment>
  );
}

export default SecretKey;
