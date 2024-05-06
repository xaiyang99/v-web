const useFilter4Week = (week, dataDates) => {
  const sortedMonths = [...week].sort((a, b) => new Date(b) - new Date(a));
  const counts = sortedMonths.map(({ startDate, endDate }) => {
    const filteredDataDates = dataDates?.filter((dataDate) => {
      const lastLoggedInDate = new Date(dataDate.lastLoggedInAt);
      return (
        lastLoggedInDate > new Date(startDate) &&
        lastLoggedInDate < new Date(endDate)
      );
    });
    return filteredDataDates?.length;
  });
  return counts;
};

export default useFilter4Week;
