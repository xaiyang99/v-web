import React from "react";
import { Chart } from "react-chartjs-2";
import useSetLabels from "../hooks/useSetLabels";
import { selectOptionState } from "../../../../redux/slices/statistics";
import { useSelector } from "react-redux";

const MyChart = () => {
  const dataOfLabels = useSetLabels();
  const selectedValue = useSelector(selectOptionState);

  const userLabel = [
    {
      value: "Active User",
      bg: activeUserColor,
      total: activeUser?.total || 0,
    },
    {
      value: "New User",
      bg: newUserColor,
      total: activeUser?.total || 0,
    },
  ];
  const options = {
    scales: {
      xAxes: [
        {
          gridLines: {
            display: true, // Set to true to show grid lines
            color: "rgba(0, 0, 0, 0.2)", // Adjust grid line color
            lineWidth: 1, // Adjust grid line width
          },
        },
      ],
      yAxes: [
        {
          gridLines: {
            display: true, // Set to true to show grid lines
            color: "rgba(0, 0, 0, 0.2)", // Adjust grid line color
            lineWidth: 1, // Adjust grid line width
          },
        },
      ],
    },
  };
  const data = {
    labels: dataOfLabels,
    datasets: [
      {
        label: userLabel[0].value,
        backgroundColor: activeUserColor,
        borderColor: activeUserColor,
        hoverBackgroundColor: activeUserColor,
        hoverBorderColor: activeUserColor,
        data: datasetEvents,
        barPercentage: 0.4,
        categoryPercentage: 0.4,
        borderRadius: 4,
      },
      {
        label: userLabel[1].value,
        backgroundColor: newUserColor,
        borderColor: newUserColor,
        hoverBackgroundColor: newUserColor,
        hoverBorderColor: newUserColor,
        data: filteredWeeklyCounts,
        barPercentage: 0.4,
        categoryPercentage: 0.4,
        borderRadius: 4,
      },
    ],
  };
  return <Chart type="bar" data={data} options={options} />;
};

export default MyChart;
