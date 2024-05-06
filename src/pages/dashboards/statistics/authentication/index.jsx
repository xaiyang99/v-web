import { Grid } from "@mui/material";
import BreadcrumbNavigate from "../../../../components/BreadcrumbNavigate";
import * as Icon from "../../../../icons/icons";
import * as MUI from "../../css/statistics";
import HeadActionFormate from "../components/HeadActionFormate";
import BarChart from "../sections/BarChart";
import Dounghnut2FA from "../sections/Dounghnut2FA";
import VerifiedSignupSocial from "../sections/VerifiedSignupSocial";
import VerifiedUserSigup from "../sections/VerifiedUserSigup";
import { useTranslation } from "react-i18next";

function Index() {
  const { t } = useTranslation();
  return (
    <div>
      <MUI.StatisticsContainer>
        <BreadcrumbNavigate
          separatorIcon={<Icon.ForeSlash />}
          path={["Statistics", "Authentication Statistics"]}
          readablePath={[t("_statistic"), t("_authentication_statistic")]}
        />
        <MUI.StatisticsPaper>
          <Grid container spacing={4}>
            <Grid item xs={12} md={12} lg={12}>
              <HeadActionFormate title={t("_authentication")} />
            </Grid>
          </Grid>
        </MUI.StatisticsPaper>
        <MUI.StatisticsPaper>
          <Grid container spacing={4}>
            <Grid item xs={12} md={6} lg={6}>
              <BarChart />
            </Grid>
            <Grid item xs={12} md={6} lg={6}>
              <VerifiedUserSigup />
            </Grid>
          </Grid>
        </MUI.StatisticsPaper>

        <Grid container spacing={4}>
          <Grid item xs={12} lg={8}>
            <MUI.StatisticsItem>
              <VerifiedSignupSocial />
            </MUI.StatisticsItem>
          </Grid>
          <Grid item xs={12} lg={4}>
            <MUI.StatisticsItem>
              <Dounghnut2FA />
            </MUI.StatisticsItem>
          </Grid>
        </Grid>
      </MUI.StatisticsContainer>
    </div>
  );
}

export default Index;
