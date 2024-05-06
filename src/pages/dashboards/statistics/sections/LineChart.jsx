import { withTheme } from "@emotion/react";
import styled from "@emotion/styled";
import { Line } from "react-chartjs-2";

import { CardContent, CardHeader, Card as MuiCard } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { spacing } from "@mui/system";
import { useDispatch, useSelector } from "react-redux";
import {
  selectOptionState,
  setOptionUserStatic,
} from "../../../../redux/slices/statistics";
import Sections from "../Sections";

const Card = styled(MuiCard)(spacing);

const ChartWrapper = styled.div`
  height: 378px;
`;

function LineChart({ theme }) {
  const selectedValue = useSelector(selectOptionState);
  const dispatch = useDispatch();
  const handleSelectChange = (e) => {
    const newValue = e.target.value;
    dispatch(setOptionUserStatic(newValue));
  };
  const data = {
    labels: [
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
    ],
    datasets: [
      {
        label: "signup",
        fill: true,
        backgroundColor: function (context) {
          const chart = context.chart;
          const { ctx, chartArea } = chart;

          if (!chartArea) {
            return null;
          }

          const gradient = ctx.createLinearGradient(0, 0, 0, 300);
          gradient.addColorStop(0, alpha(theme.palette.primary.main, 1));
          gradient.addColorStop(1, alpha(theme.palette.primary.main, 0.0975));

          return gradient;
        },

        borderColor: theme.palette.primary.main,
        hoverBackgroundColor: theme.palette.primary.main,
        hoverBorderColor: theme.palette.primary.main,
        pointStyle: false,
        tension: 0,
        showLine: true,
        data: [
          10, 100, 1800, 1800, 1800, 5000, 5000, 2448, 2905, 3838, 2917, 3327,
        ],
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      elements: {
        point: {
          radius: 0,
        },
      },
    },
    scales: {
      y: {
        grid: {
          display: false,
        },
        stacked: false,
        ticks: {
          stepSize: 5,
          fontColor: theme.palette.text.secondary,
        },
        min: 0,
        max: 10000,
      },

      x: {
        stacked: false,
        grid: {
          color: "transparent",
        },
        ticks: {
          fontColor: theme.palette.text.secondary,
        },
      },
    },
  };

  return (
    <Card
      mb={6}
      sx={{
        boxShadow: (theme) => theme.baseShadow.secondary,
      }}
    >
      <CardHeader
        action={
          <Sections
            selectedValue={selectedValue.optionUserStatic}
            dispatch={handleSelectChange}
          />
        }
        title="Total revenue"
      />
      <CardContent>
        <ChartWrapper>
          <Line data={data} options={options} />
        </ChartWrapper>
      </CardContent>
    </Card>
  );
}
export default withTheme(LineChart);
