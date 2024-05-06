import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Title,
  Tooltip,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { useSelector } from "react-redux";
import { intToPrettyString } from "../../../../../functions";
import { paymentState } from "../../../../../redux/slices/paymentSlice";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const BarChart = (props) => {
  const paymentSelector = useSelector(paymentState);
  const { freeList, proList, premiumList } = props.data;
  const options = {
    responsive: true,
    maintainAspectRatio: false,
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
        ticks: {
          stepSize: 10,
          max: 100,
          maxTicksLimit: 6,
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
          label: (tooltipItems) => {
            return `${paymentSelector.currencySymbol} ${intToPrettyString(
              tooltipItems.raw
            )} (${_.capitalize(tooltipItems.dataset.name)})`;
          },
        },
      },
    },
  };

  const getHighestValueBgColor = (inputData = []) => {
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
        name: "free",
        data: freeList,
        backgroundColor: getHighestValueBgColor(freeList),
        borderSkipped: false,
        barPercentage: 1.0,
        categoryPercentage: 0.75,
        borderRadius: [],
      },
      {
        name: "pro",
        data: proList,
        backgroundColor: getHighestValueBgColor(proList),
        borderSkipped: false,
        barPercentage: 1.0,
        categoryPercentage: 0.75,
        borderRadius: [],
      },
      {
        name: "premium",
        data: premiumList,
        backgroundColor: getHighestValueBgColor(premiumList),
        borderSkipped: false,
        barPercentage: 1.0,
        categoryPercentage: 0.75,
        borderRadius: [],
      },
    ],
  };
  return (
    <Bar
      redraw
      options={options}
      data={barData}
      plugins={[
        {
          beforeLayout: (chart) => {
            let datasets = chart.data.datasets;
            for (let i = 0; i < datasets.length; i++) {
              for (let j = 0; j < datasets[i].data.length; j++) {
                if (datasets[i].data[j] < 0) {
                  chart.data.datasets[i].borderRadius[j] = {
                    bottomLeft: 8,
                    bottomRight: 8,
                  };
                } else {
                  chart.data.datasets[i].borderRadius[j] = {
                    topLeft: 8,
                    topRight: 8,
                  };
                }
              }
            }
          },
        },
      ]}
    />
  );
};
export default BarChart;
