import { alpha } from "@mui/system";
import { useSelector } from "react-redux";
import { selectOptionState } from "../../../../redux/slices/statistics";

const useUploadDownloadData = ({
  customeTheme,
  labels,
  title,
  datasetEvents,
}) => {
  const selectedValue = useSelector(selectOptionState);
  return {
    labels: labels,
    datasets: [
      {
        label: title,
        fill: true,
        backgroundColor: function (context) {
          const chart = context.chart;
          const { ctx, chartArea } = chart;

          if (!chartArea) {
            return null;
          }

          const gradient = ctx.createLinearGradient(0, 0, 0, 360);
          gradient.addColorStop(0, alpha(customeTheme, 0.85));
          gradient.addColorStop(0.8, alpha(customeTheme, 0));

          return gradient;
        },

        borderColor: customeTheme,
        hoverBackgroundColor: customeTheme,
        hoverBorderColor: customeTheme,
        pointStyle: false,
        tension: 0.4,
        showLine: true,
        data: selectedValue.refreshing ? 0 : datasetEvents,
      },
    ],
  };
};

export default useUploadDownloadData;
