import { Grid } from "@mui/material";
import BreadcrumbNavigate from "../../../../components/BreadcrumbNavigate";
import * as Icon from "../../../../icons/icons";
import * as MUI from "../../css/statistics";
import HeadActionFormate from "../components/HeadActionFormate";
import UploadCount from "../sections/UploadCount";
import UploadCountry from "../sections/UploadCountry";
import UploadDevice from "../sections/UploadDevice";
import UploadFailed from "../sections/UploadFailed";
import UploadSize from "../sections/UploadSize";
import UploadSuccess from "../sections/UploadSuccess";
import { useTranslation } from "react-i18next";
function index() {
  const { t } = useTranslation();
  return (
    <div>
      <MUI.StatisticsContainer>
        <BreadcrumbNavigate
          separatorIcon={<Icon.ForeSlash />}
          path={["Statistics", "Upload & download"]}
          readablePath={[t("_statistic"), t("_upload_and_download")]}
        />
        <MUI.StatisticsPaper>
          <Grid container spacing={4}>
            <Grid item xs={12} md={12} lg={12}>
              <HeadActionFormate title={t("_upload_and_download")} />
            </Grid>
          </Grid>
        </MUI.StatisticsPaper>
        <MUI.StatisticsPaper>
          <Grid container spacing={4}>
            <Grid item xs={12} md={6} lg={4}>
              <UploadCount />
            </Grid>
            <Grid item xs={12} md={6} lg={4}>
              <UploadSize />
            </Grid>
            <Grid item xs={12} md={6} lg={4}>
              <UploadSuccess />
            </Grid>
          </Grid>
        </MUI.StatisticsPaper>

        <Grid container spacing={4}>
          <Grid item xs={12} lg={4} md={6}>
            <MUI.StatisticsItem>
              <UploadFailed />
            </MUI.StatisticsItem>
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <UploadDevice />
          </Grid>
          <Grid item xs={12} lg={4} md={6}>
            <MUI.StatisticsItem>
              <UploadCountry />
            </MUI.StatisticsItem>
          </Grid>
        </Grid>
      </MUI.StatisticsContainer>
    </div>
  );
}

export default index;
