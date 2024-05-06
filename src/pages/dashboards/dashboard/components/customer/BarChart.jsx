import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Title,
  Tooltip,
} from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { Bar } from "react-chartjs-2";
import { intToPrettyString } from "../../../../../functions";
import { externalTooltipHandler } from "./externalTooltips";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const BarChart = (props) => {
  const data = props.data.list;
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    layout: {
      padding: {
        top: 30,
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
      },

      y: {
        afterTickToLabelConversion: (tickData) => {
          for (var key in tickData.ticks) {
            tickData.ticks[key].label = intToPrettyString(
              tickData.ticks[key].value
            );
          }
        },
        ticks: {
          stepSize: 10,
          maxTicksLimit: 6,
        },
        grid: {
          display: false,
        },

        border: {
          display: false,
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      datalabels: {
        anchor: "end",
        align: "end",
        formatter: (value, context) => {
          return intToPrettyString(value);
        },
      },
      tooltip: {
        callbacks: {
          label: (xDatapoint) => {
            return intToPrettyString(xDatapoint.raw);
          },
        },
        enabled: false,
        external: externalTooltipHandler,
      },
    },
  };

  const getHighestValueBgColor = () => {
    const inputData = data || [];
    var maxValue = Math.max(...inputData);
    var highestNegativeValue = Math.min(...inputData);
    var bg = inputData.map((a) => {
      return a < 0
        ? a === highestNegativeValue
          ? "rgb(234, 84, 85)"
          : "rgba(234, 84, 85,0.25)"
        : a === maxValue
        ? "rgb(23,118,107)"
        : "rgba(23,118,107,0.25)";
    });
    return bg;
  };

  const barData = {
    labels: props.labels,
    datasets: [
      {
        externalData: {
          anonymousList: props.data.anonymousList,
          maleList: props.data.maleList,
          femaleList: props.data.femaleList,
        },
        data,
        backgroundColor: getHighestValueBgColor(),
        barThickness: 30,
        borderSkipped: false,
        borderRadius: [],
      },
    ],
  };

  return (
    <Bar
      options={options}
      data={barData}
      plugins={[
        ChartDataLabels,
        {
          beforeLayout: (chart) => {
            let datasets = chart.data.datasets[0];
            for (let i = 0; i < datasets.data.length; i++) {
              if (datasets.data[i] < 0) {
                chart.data.datasets[0].borderRadius[i] = {
                  bottomLeft: 5,
                  bottomRight: 5,
                };
              } else {
                chart.data.datasets[0].borderRadius[i] = {
                  topLeft: 5,
                  topRight: 5,
                };
              }
            }
          },
        },
      ]}
    />
  );
};
export default BarChart;
