const useFilterYear = (year, dataDates) => {
  const currentDate = new Date();
  const fiveYearsAgo = new Date();

  fiveYearsAgo.setFullYear(currentDate.getFullYear() - 5);

  const sortedYears = [...year].sort((a, b) => new Date(b) - new Date(a));
  const counts = sortedYears.map((selectedYear) => {
    const filteredDataDates = dataDates?.filter((dataDate) => {
      const createdAtDate = new Date(
        dataDate?.createdAt ?? dataDate?.orderedAt ?? dataDate?.updatedAt
      );
      return createdAtDate.getFullYear() === parseInt(selectedYear, 10);
    });
    return filteredDataDates?.length;
  });
  return counts;
};

export default useFilterYear;
