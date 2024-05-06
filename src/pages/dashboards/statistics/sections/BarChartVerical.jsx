import { withTheme } from "@emotion/react";
import styled from "@emotion/styled";
import { CardContent, CardHeader, Card as MuiCard } from "@mui/material";
import { spacing } from "@mui/system";
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
import { useDispatch, useSelector } from "react-redux";
import {
  selectOptionState,
  setOptionVerifySignupStatic,
} from "../../../../redux/slices/statistics";
import Sections from "../Sections";
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);
const Card = styled(MuiCard)(spacing);

const ChartWrapper = styled.div`
  height: 340px;
  width: 100%;
`;
const BarChartVerical = ({ theme }) => {
  const firstDatasetColor = theme.palette.orangeTheme.main;
  const secondDatasetColor = theme.palette.primary.main;
  const selectedValue = useSelector(selectOptionState);
  const dispatch = useDispatch();
  const handleSelectChange = (e) => {
    const newValue = e.target.value;
    dispatch(setOptionVerifySignupStatic(newValue));
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
      },
    },

    scales: {
      y: {
        grid: {
          display: false,
        },
        stacked: true,
        ticks: {
          stepSize: 20,
          fontColor: theme.palette.text.secondary,
        },
        beginAtZero: true,
        min: -100,
        max: 100,
      },

      x: {
        beginAtZero: true,
        stacked: true,
        grid: {
          color: "transparent",
        },
        ticks: {
          fontColor: theme.palette.text.secondary,
        },
      },
    },
  };

  const labels = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const data = {
    labels,
    datasets: [
      {
        label: "New Users",
        backgroundColor: firstDatasetColor,
        borderColor: firstDatasetColor,
        hoverBackgroundColor: firstDatasetColor,
        hoverBorderColor: firstDatasetColor,
        data: [54, 67, 41, 55, 62, 45, 55, 73, 60, 76, 48, 79],
        barPercentage: 0.4,
        categoryPercentage: 0.4,
        borderRadius: 6,
      },
      {
        label: "Active Users",
        backgroundColor: secondDatasetColor,
        borderColor: secondDatasetColor,
        hoverBackgroundColor: secondDatasetColor,
        hoverBorderColor: secondDatasetColor,
        data: [-20, -24, -48, -52, -51, -44, -53, -62, -79, -51, -68, -100],
        barPercentage: 0.4,
        categoryPercentage: 0.4,
        borderRadius: 6,
      },
    ],
  };
  return (
    <Card
      sx={{
        height: "100%",
        boxShadow: (theme) => theme.baseShadow.secondary,
      }}
    >
      <CardHeader
        action={
          <Sections
            selectedValue={selectedValue.optionSignupStatic}
            dispatch={handleSelectChange}
          />
        }
        title="User Statistic"
      />

      <CardContent
        sx={{
          paddingBottom: "0 !important",
        }}
      >
        <ChartWrapper>
          <Bar options={options} data={data} />
        </ChartWrapper>
      </CardContent>
    </Card>
  );
};
export default withTheme(BarChartVerical);
