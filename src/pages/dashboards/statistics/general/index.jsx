import { Grid } from "@mui/material";
import BreadcrumbNavigate from "../../../../components/BreadcrumbNavigate";
import * as Icon from "../../../../icons/icons";
import * as MUI from "../../css/statistics";
import HeadActionFormate from "../components/HeadActionFormate";
import Annoucement from "../sections/Annoucement";
import BroadcastChart from "../sections/BroadcastChart";
import CouponChart from "../sections/CouponChart";
import TicketChart from "../sections/TicketChart";
import Advertisement from "../sections/Advertisement";
import { useTranslation } from "react-i18next";

function index() {
  const { t } = useTranslation();
  return (
    <div>
      <MUI.StatisticsContainer>
        <BreadcrumbNavigate
          separatorIcon={<Icon.ForeSlash />}
          path={["Statistics", "General Statistics"]}
          readablePath={[t("_statistic"), t("_general_statistic_title")]}
        />
        <MUI.StatisticsPaper>
          <Grid container spacing={4}>
            <Grid item xs={12} md={12} lg={12}>
              <HeadActionFormate title={t("_general_statistic_title")} />
            </Grid>
          </Grid>
        </MUI.StatisticsPaper>
        <MUI.StatisticsPaper>
          <Grid container spacing={4}>
            <Grid item xs={12} md={6} lg={6}>
              <BroadcastChart />
            </Grid>
            <Grid item xs={12} md={6} lg={6}>
              <CouponChart />
            </Grid>
          </Grid>
        </MUI.StatisticsPaper>
        <Grid container spacing={4}>
          <Grid item xs={12} lg={6}>
            <MUI.StatisticsItem>
              <Annoucement />
            </MUI.StatisticsItem>
          </Grid>
          <Grid item xs={12} lg={6}>
            <MUI.StatisticsItem>
              <TicketChart />
            </MUI.StatisticsItem>
          </Grid>
        </Grid>
        <Grid container spacing={4}>
          <Grid item xs={12} lg={6}>
            <MUI.StatisticsItem>
              <Advertisement />
            </MUI.StatisticsItem>
          </Grid>
        </Grid>
      </MUI.StatisticsContainer>
    </div>
  );
}

export default index;
