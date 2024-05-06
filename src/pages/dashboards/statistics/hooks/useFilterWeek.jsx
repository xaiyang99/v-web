const useFilterWeek = (weeklyDateDates, dataDates) => {
  const countWeeklyArray = weeklyDateDates
    ?.sort((a, b) => new Date(b) - new Date(a))
    ?.map((date) => {
      const count = dataDates?.filter((dataDate) => dataDate === date).length;
      return count;
    });
  return countWeeklyArray;
};

export default useFilterWeek;
