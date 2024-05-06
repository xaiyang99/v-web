import { Fragment, useEffect, useState } from "react";
import {
  Box,
  FormControlLabel,
  FormGroup,
  Paper,
  Typography,
} from "@mui/material";
import * as MUI from "../css/settingStyle";
import * as Icon from "../../../icons/icons";
import BreadcrumbNavigate from "../../../components/BreadcrumbNavigate";
// import logoIcon from "../../../image/no_image.jpg";
import { useMutation } from "@apollo/client";
import { MUTATION_UPDATE_SETTING } from "../settings/apollo";
import { errorMessage, successMessage } from "../../../components/Alerts";
import useManageSetting from "../settings/hooks/useManageSetting";
import stripIcon from "../../../icons/stripe.png";
import walletIcon from "../../../icons/wallet.png";
import cryptoIcon from "../../../icons/bitcoin.png";
import bcelIcon from "../../../icons/bcel-one.png";
import { useTranslation } from "react-i18next";
import { handleGraphqlErrors } from "../../../functions";

function PaymentSetting() {
  const { t } = useTranslation();
  const [isStriped, setStriped] = useState(false);
  const [isCrypto, setCrypto] = useState(false);
  const [isWallet, setWallet] = useState(false);
  const [isBcel, setBcel] = useState(false);

  const [updateSetting] = useMutation(MUTATION_UPDATE_SETTING);
  const useDataSetting = useManageSetting();

  const settingKeys = {
    stripe: "SRIPETE",
    crypto: "CYTSOOE",
    wallet: "WLLETAE",
    bcelOne: "CELBENE",
  };

  async function handleUpdateData(value, key) {
    try {
      const result = await updateSetting({
        variables: {
          data: {
            status: value ? "on" : "off",
          },
          where: {
            productKey: key,
          },
        },
      });

      if (result?.data?.updateGeneral_settings?._id) {
        successMessage("Data updated successfully", 2000);
      }
    } catch (error) {
      let cutErr = error.message.replace(/(ApolloError: )?Error: /, "");
      errorMessage(handleGraphqlErrors(cutErr), 3000);
    }
  }

  const findDataSetting = (productKey) => {
    const dataSetting = useDataSetting.data?.find(
      (data) => data?.productKey === productKey,
    );

    return dataSetting;
  };

  useEffect(() => {
    function getDataSettings() {
      // Stripe
      const resStripe = findDataSetting(settingKeys.stripe);
      if (!!resStripe) {
        setStriped(resStripe?.status === "on" ? true : false);
      }

      // Crypto
      const resCrypto = findDataSetting(settingKeys.crypto);
      if (!!resCrypto) {
        setCrypto(resCrypto?.status === "on" ? true : false);
      }

      // Wallet
      const resWallet = findDataSetting(settingKeys.wallet);
      if (!!resWallet) {
        setWallet(resWallet?.status === "on" ? true : false);
      }

      // BCEL One
      const resBcel = findDataSetting(settingKeys.bcelOne);
      if (!!resBcel) {
        setBcel(resBcel?.status === "on" ? true : false);
      }

      // End
    }

    getDataSettings();
  }, [useDataSetting.data]);

  return (
    <Fragment>
      <BreadcrumbNavigate
        separatorIcon={<Icon.ForeSlash />}
        title="Setting"
        path={["Setting"]}
        readablePath={["Setting", "Payment setting"]}
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
            {/* Payment Header */}
            <MUI.SettingHeaderContainer>
              <Typography variant="h1">{t("_payment_method")}</Typography>
              <Typography variant="h4">
                {t("_payment_method_description")}
              </Typography>
            </MUI.SettingHeaderContainer>

            {/* Strip */}
            <MUI.SettingHeaderContainer>
              <MUI.SettingPaymentContainer>
                <MUI.SettingPaymentItem>
                  <Box className="payment-icon">
                    <Typography
                      component="img"
                      src={stripIcon}
                      alt="payment-strip"
                    />
                  </Box>

                  <MUI.SettingPaymentText>
                    <Typography variant="h2">Stripe</Typography>
                    <Typography component="span">
                      {t("_strip_description")}
                    </Typography>
                  </MUI.SettingPaymentText>
                </MUI.SettingPaymentItem>

                <FormGroup row>
                  <Box className="sub-toggle">
                    <FormControlLabel
                      control={
                        <MUI.SwitchToggle
                          inputProps={{ "aria-label": "ant design" }}
                          checked={isStriped}
                          onChange={(e) => {
                            setStriped(e.target.checked);
                            handleUpdateData(
                              e.target.checked,
                              settingKeys.stripe,
                            );
                          }}
                        />
                      }
                    />
                  </Box>
                </FormGroup>
              </MUI.SettingPaymentContainer>
            </MUI.SettingHeaderContainer>

            {/* Crypto */}
            <MUI.SettingHeaderContainer>
              <MUI.SettingPaymentContainer>
                <MUI.SettingPaymentItem>
                  <Box className="payment-icon">
                    <Typography
                      component="img"
                      src={cryptoIcon}
                      alt="payment-crypto"
                    />
                  </Box>

                  <MUI.SettingPaymentText>
                    <Typography variant="h2">Crypto</Typography>
                    <Typography component="span">
                      {t("_crypto_description")}
                    </Typography>
                  </MUI.SettingPaymentText>
                </MUI.SettingPaymentItem>

                <FormGroup row>
                  <Box className="sub-toggle">
                    <FormControlLabel
                      control={
                        <MUI.SwitchToggle
                          inputProps={{ "aria-label": "ant design" }}
                          checked={isCrypto}
                          onChange={(e) => {
                            setCrypto(e.target.checked);
                            handleUpdateData(
                              e.target.checked,
                              settingKeys.crypto,
                            );
                          }}
                        />
                      }
                    />
                  </Box>
                </FormGroup>
              </MUI.SettingPaymentContainer>
            </MUI.SettingHeaderContainer>

            {/* Wallet */}
            <MUI.SettingHeaderContainer>
              <MUI.SettingPaymentContainer>
                <MUI.SettingPaymentItem>
                  <Box className="payment-icon">
                    <Typography
                      component="img"
                      src={walletIcon}
                      alt="payment-wallet"
                    />
                  </Box>

                  <MUI.SettingPaymentText>
                    <Typography variant="h2">Wallet</Typography>
                    <Typography component="span">
                      {t("_wallet_description")}
                    </Typography>
                  </MUI.SettingPaymentText>
                </MUI.SettingPaymentItem>

                <FormGroup row>
                  <Box className="sub-toggle">
                    <FormControlLabel
                      control={
                        <MUI.SwitchToggle
                          inputProps={{ "aria-label": "ant design" }}
                          checked={isWallet}
                          onChange={(e) => {
                            setWallet(e.target.checked);
                            handleUpdateData(
                              e.target.checked,
                              settingKeys.wallet,
                            );
                          }}
                        />
                      }
                    />
                  </Box>
                </FormGroup>
              </MUI.SettingPaymentContainer>
            </MUI.SettingHeaderContainer>

            {/* BCEL One */}
            <MUI.SettingHeaderContainer>
              <MUI.SettingPaymentContainer>
                <MUI.SettingPaymentItem>
                  <Box className="payment-icon">
                    <Typography
                      component="img"
                      src={bcelIcon}
                      alt="payment-bcel"
                    />
                  </Box>

                  <MUI.SettingPaymentText>
                    <Typography variant="h2">Bcel one</Typography>
                    <Typography component="span">
                      {t("_bcelone_description")}
                    </Typography>
                  </MUI.SettingPaymentText>
                </MUI.SettingPaymentItem>

                <FormGroup row>
                  <Box className="sub-toggle">
                    <FormControlLabel
                      control={
                        <MUI.SwitchToggle
                          inputProps={{ "aria-label": "ant design" }}
                          checked={isBcel}
                          onChange={(e) => {
                            setBcel(e.target.checked);
                            handleUpdateData(
                              e.target.checked,
                              settingKeys.bcelOne,
                            );
                          }}
                        />
                      }
                    />
                  </Box>
                </FormGroup>
              </MUI.SettingPaymentContainer>
            </MUI.SettingHeaderContainer>
          </MUI.SettingWrapperContainer>
        </Paper>
      </MUI.SettingContainer>
    </Fragment>
  );
}

export default PaymentSetting;
