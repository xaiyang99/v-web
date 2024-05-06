import { useTheme } from "@mui/material";
import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Title,
  Tooltip,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { intToPrettyString } from "../../../../../functions";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const LineChart = (props) => {
  const { list } = props.data;
  const theme = useTheme();
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    elements: {
      point: {
        radius: 0,
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        border: {
          display: false,
        },
      },
      y: {
        afterTickToLabelConversion: (tickData) => {
          for (var key in tickData.ticks) {
            for (let i = 0; i < tickData.chart.data.datasets.length; i++) {
              tickData.ticks[key].label = intToPrettyString(
                tickData.ticks[key].value
              );
            }
          }
        },
        border: {
          display: false,
          dash: [10, 15],
        },
      },
    },
    plugins: {
      legend: {
        display: false,
        labels: {
          usePointStyle: true,
        },
      },
      tooltip: {
        callbacks: {
          label: (tooltipItems) => {
            return `${intToPrettyString(tooltipItems.raw)}`;
          },
        },
      },
    },
  };

  const getHighestValueBgColor = () => {
    var maxValue = Math.max(...mockData);
    var bg = mockData.map((a) => {
      return a === maxValue
        ? theme.palette.primaryTheme.main
        : "rgba(23,118,107,0.25)";
    });
    return bg;
  };

  const data = {
    labels: props.labels,
    datasets: [
      {
        data: list,
        borderColor: theme.palette.primaryTheme.main,
        barThickness: 30,
        borderSkipped: false,
        pointStyle: "circle",
        pointBackgroundColor: theme.palette.primaryTheme.main,
        borderRadius: 5,
        fill: true,
        backgroundColor: ({ chart: { ctx } }) => {
          const gradient = ctx.createLinearGradient(0, 0, 0, 400);
          gradient?.addColorStop(0, "rgba(23,118,107,.18)");
          gradient?.addColorStop(1, "rgba(255,255,255,.1)");
          return gradient;
        },
      },
    ],
  };

  return (
    <>
      <Line options={options} data={data} />
    </>
  );
};
export default LineChart;
