const useFilter12Month = (month, dataDates) => {
  const sortedMonths = [...month].sort((a, b) => new Date(b) - new Date(a));
  const counts = sortedMonths.map(({ startDate, endDate }) => {
    const filteredDataDates = dataDates?.filter((dataDate) => {
      const createdAt =
        dataDate?.createdAt ?? dataDate?.orderedAt ?? dataDate.updatedAt;
      const slicedDate = createdAt?.slice(0, 10);
      return slicedDate >= startDate && slicedDate <= endDate;
    });
    return filteredDataDates?.length;
  });
  return counts;
};
export default useFilter12Month;
