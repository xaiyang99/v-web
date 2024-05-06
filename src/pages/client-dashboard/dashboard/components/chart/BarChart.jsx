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
import { ConvertBytetoMBandGB } from "../../../../../functions";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const BarChart = (props) => {
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
        grid: {
          display: false,
        },
        ticks: {
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
      tooltip: {
        callbacks: {
          label: (xDatapoint) => {
            return ConvertBytetoMBandGB(xDatapoint.raw);
          },
        },
      },
    },
  };

  const getHighestValueBgColor = () => {
    var maxValue = Math.max(...props.data);

    var bg = props.data.map((a) =>
      a === maxValue ? "rgb(23,118,107)" : "rgba(23,118,107,0.25)"
    );
    return bg;
  };

  const Bardata = {
    labels: props.labels,
    datasets: [
      {
        data: props.data,
        backgroundColor: getHighestValueBgColor(),
        barThickness: 30,
        borderSkipped: false,
        borderRadius: 5,
      },
    ],
  };
  return <Bar options={options} data={Bardata} />;
};
export default BarChart;
