export default function monthName() {
  const monthNames = [
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
  return monthNames;
}
export const customRanges = [
  {
    label: "Last 7 Days",
    value: [
      new Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000),
      new Date(),
    ],
  },
  {
    label: "Last 30 Days",
    value: [
      new Date(new Date().getTime() - 30 * 24 * 60 * 60 * 1000),
      new Date(),
    ],
  },
];
