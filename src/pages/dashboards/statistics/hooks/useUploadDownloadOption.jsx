const useUploadDownloadOption = ({ maxValue, themeFont }) => {
  return {
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
        stacked: true,
        ticks: {
          display: false,
        },

        border: {
          color: "transparent",
        },
        min: 0,
        max: maxValue,
      },

      x: {
        border: {
          color: "transparent",
        },
        stacked: false,
        grid: {
          display: false,
        },
        ticks: {
          fontColor: themeFont,
        },
      },
    },
  };
};

export default useUploadDownloadOption;
