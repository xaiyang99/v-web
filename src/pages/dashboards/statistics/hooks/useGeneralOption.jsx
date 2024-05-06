import { formateViews } from "../../../../functions";

function useGeneralOption({ customTheme, maxValue }) {
  const options = {
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      x: {
        grid: {
          color: "rgba(0,0,0,0.0)",
          backgroundColor: "#000",
        },
      },
      y: {
        border: {
          dash: [5, 5],
          color: "transparent",
        },
        grid: {
          display: true,
          color: "#DBDADE",
        },
        ticks: {
          count: maxValue < 8 ? 6 : 8,
          fontColor: customTheme.secondaryText,
          callback: (value) => formateViews(Math?.round(value)),
        },
        beginAtZero: true,

        min: 0,
        max: maxValue,
      },
    },
  };
  const myPlugin = {
    id: "customShadow",
    beforeDraw: (chart) => {
      const ctx = chart.ctx;
      ctx.save();

      const originalLineDraw = ctx.stroke;
      ctx.stroke = function () {
        ctx.save();
        ctx.shadowColor = customTheme.bg;
        ctx.shadowBlur = 16;
        ctx.shadowOffsetX = 2;
        ctx.shadowOffsetY = 2;
        originalLineDraw.apply(this, arguments);
        ctx.restore();
      };
    },
  };

  return { options, myPlugin };
}

export default useGeneralOption;
