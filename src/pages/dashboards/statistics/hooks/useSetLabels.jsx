import { compareIndochinaDateToGeneral } from "../../../../functions";

const useSetLabels = () => {
  const weekly = [];
  const weeklyDates = [];
  const currentDate = new Date();

  // weekly
  for (let i = 0; i < 7; i++) {
    const date = new Date(currentDate);
    date.setDate(currentDate.getDate() - i);

    const formattedDate = date.toLocaleDateString("en-US", {
      weekday: "short",
    });

    weekly.push(formattedDate);
  }
  // funtion get date weeked
  const valueDateOfWeeked = () => {
    const today = new Date();
    const sixDaysAgo = new Date(today);
    sixDaysAgo.setDate(today.getDate() - 6);

    const dates = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(sixDaysAgo);
      date.setDate(sixDaysAgo.getDate() + i);
      dates.push(date);
      weeklyDates.push(compareIndochinaDateToGeneral(date));
    }

    return dates;
  };
  const dateOfWeeked = valueDateOfWeeked();
  const firstWeeklyDate = dateOfWeeked[0];
  const lastWeeklyDate = dateOfWeeked[dateOfWeeked.length - 1];

  // get lasted 1 day and 7 day for 1 week ago
  const last1Day = new Date(lastWeeklyDate).toISOString().split("T")[0];
  const last7Day = new Date(firstWeeklyDate).toISOString().split("T")[0];

  // last 4 week per month
  const last4Weeks = [];

  for (let i = 0; i < 4; i++) {
    const endDate = new Date(currentDate);
    endDate.setDate(currentDate.getDate() - i * 7);

    const startDate = new Date(endDate);
    startDate.setDate(endDate.getDate() - 6); // End date is 6 days after the start date

    last4Weeks.push({
      endDate: startDate.toISOString().slice(0, 10),
      startDate: endDate.toISOString().slice(0, 10),
    });
  }
  const get12MonthLastYearDates = () => {
    const currentDate = new Date();
    const monthsDates = [];

    for (let i = 13; i <= 24; i++) {
      const monthDate = new Date(currentDate);
      monthDate.setMonth(currentDate.getMonth() - i);
      monthsDates.push(monthDate.toISOString().split("T")[0]);
    }

    return monthsDates;
  };

  // Example usage
  const lasted12Month = get12MonthLastYearDates();
  const firstLastedDate = lasted12Month[0];
  const lastLastedDate = lasted12Month[lasted12Month.length - 1];
  // 12 month
  const monthly = (numberOfMonths) => {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const monthlyAbbreviations = [];

    Array.from({ length: numberOfMonths }, (_, i) => {
      const monthIndex = (currentMonth - i + 12) % 12;
      const monthAbbreviation = new Date(1, monthIndex).toLocaleString(
        "en-US",
        {
          month: "short",
        }
      );
      const formattedMonth =
        monthIndex === currentMonth
          ? `1${monthAbbreviation}`
          : `${12 - i + 1}${monthAbbreviation}`;

      monthlyAbbreviations.push(formattedMonth);
    });
    if (
      monthlyAbbreviations[0] !==
      `1${new Date(0, currentMonth).toLocaleString("en-US", {
        month: "short",
      })}`
    ) {
      monthlyAbbreviations.reverse();
    }
    return monthlyAbbreviations;
  };

  // date value 12 month per yearly
  const last12MonthsDates = () => {
    const currentDate = new Date();
    const last12Months = [];

    for (let i = 0; i < 12; i++) {
      const month = currentDate.getMonth() - i;
      const year = currentDate.getFullYear();
      const adjustedMonth = (month - 12) % 12;

      const startDate = new Date(year, adjustedMonth, 2);
      const endDate = new Date(year, adjustedMonth + 1, 1);

      last12Months.push({
        startDate: startDate.toISOString().slice(0, 10),
        endDate: endDate.toISOString().slice(0, 10),
      });
    }

    return last12Months;
  };

  // get yearly
  const yearly = (numberOfYears) => {
    const currentYear = currentDate.getFullYear();
    const dateYearly = [currentYear];
    return Array.from({ length: numberOfYears }, (_, index) => {
      const year = currentYear - index;
      dateYearly.push(year);
      const dateString = `${year}`;
      return dateString;
    });
  };
  const dateYearly = yearly(5);

  const yearlyFullDate = (numberOfYears) => {
    const currentYear = new Date().getFullYear();
    return Array.from({ length: numberOfYears }, (_, index) => {
      const year = currentYear - index;
      const startDate = new Date(year, 11, 31);
      const endDate = new Date(year, 0, 2);

      const formattedStartDate = startDate.toISOString().slice(0, 10);
      const formattedEndDate = endDate.toISOString().slice(0, 10);

      return { startDate: formattedStartDate, endDate: formattedEndDate };
    });
  };

  const dateFullYearly = yearlyFullDate(5);
  return {
    lasted12Month: { startDate: firstLastedDate, endDate: lastLastedDate },
    dateOfWeeked,
    weekly,
    weeklyDates,
    firstWeeklyDate,
    lastWeeklyDate,
    monthly,
    yearly,
    dateYearly,
    dateFullYearly,
    last12MonthsDates,
    last4Weeks,
    last1Week: { startDate: last1Day, endDate: last7Day },
  };
};

export default useSetLabels;
