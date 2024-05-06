function useGeneralData({ title, labels, customTheme, datasetEvents }) {
  return {
    labels: labels,
    datasets: [
      {
        label: title ?? "Broadcast",
        borderColor: customTheme.bg,
        backgroundColor: "transparent",
        pointBackgroundColor: "white",
        fill: false,
        borderWidth: 3,
        pointRadius: 4,
        hitRadius: 5,
        pointHoverRadius: 6,
        pointHoverBackgroundColor: customTheme.color,
        pointHoverBorderColor: customTheme?.bg,
        pointHoverBorderWidth: 2,
        tension: 0.5,
        data: datasetEvents,
      },
    ],
  };
}

export default useGeneralData;
