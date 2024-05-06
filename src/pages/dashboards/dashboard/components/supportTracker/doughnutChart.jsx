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
import { useMemo } from "react";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const DoughnutChart = (props) => {
  const theme = useTheme();
  const options = {
    hover: { mode: null },
    borderWidth: 0,
    responsive: true,
    maintainAspectRatio: false,
    rotation: 210,
    cutout: "70%",
    elements: {
      point: {
        radius: 0,
      },
    },
    spacing: 110,
    scales: {
      x: {
        ticks: {
          display: false,
        },
        grid: {
          display: false,
        },
        border: {
          display: false,
        },
      },
      y: {
        ticks: {
          display: false,
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
      /* tooltip: {
        callbacks: {
          label: (xDatapoint) => {
            return ConvertBytetoMBandGB(xDatapoint.raw);
          },
        },
      }, */
      tooltip: {
        filter: function (tooltipItem) {
          return false;
          /* return tooltipItem.dataIndex !== tooltipItem.dataset.data.length - 1; */
        },
      },
    },
  };

  const data = useMemo(() => {
    const completedTask = props.data.percent.completedTask;
    const percent = completedTask >= 100 ? 100 : completedTask;
    const slicedPercent = Math.floor(percent / 2.5);
    return {
      labels: ["test"],
      datasets: [
        {
          data: [
            {
              percent: percent,
              slicedPercent: slicedPercent,
            },
          ],
          borderSkipped: false,
          borderRadius: 0,
          backgroundColor: ({ chart: { ctx, ...chart } }) => {
            const angle = Math.PI / 180;
            const x2 = 200 * Math.cos(angle);
            const y2 = 200 * Math.sin(angle);
            const gradient = ctx.createLinearGradient(0, 0, x2, y2);
            gradient?.addColorStop(0, "rgba(255,255,255,1)");
            gradient?.addColorStop(1, "rgba(23,118,107,1)");
            return [
              ...Array.from({ length: slicedPercent }).map((_value) =>
                percent === 100 ? theme.palette.primaryTheme.main : gradient
              ),
              "#FFFFFF",
            ];
          },
        },
      ],
    };
  }, [props.data.percent.completedTask]);

  return (
    <>
      <Doughnut
        redraw
        options={{
          ...options,
        }}
        data={data}
        plugins={[
          {
            beforeInit: (chart) => {
              const chartData = chart.data.datasets[0].data[0];
              const percent = chartData.percent;
              const slicedPercent = chartData.slicedPercent;
              chart.data.datasets[0].data = [
                ...Array.from({ length: slicedPercent }).map((_value) => 2.5),
                ...(100 - percent <= 0 ? [] : [100 - percent]),
              ];
            },
          },
        ]}
      />
    </>
  );
};
export default DoughnutChart;
