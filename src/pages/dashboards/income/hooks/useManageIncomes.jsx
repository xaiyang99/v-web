import { useLazyQuery } from "@apollo/client";
import React from "react";
import { QUERY_INCOMES } from "../apollo";

const useManageIncomes = ({ filter }) => {
  const [getIncomes, { data: dataIncomes }] = useLazyQuery(QUERY_INCOMES, {
    fetchPolicy: "no-cache",
  });
  const [selectedRow, setSelectedRow] = React.useState([]);

  const customGetIncomes = () => {
    const {
      pageLimit,
      status,
      currentPageNumber,
      paymentCategory,
      paymentMethod,
      createdAt,
      packageId,
    } = filter;
    const skip = (currentPageNumber - 1) * pageLimit;

    getIncomes({
      variables: {
        orderBy: "createdAt_DESC",
        where: {
          ...(paymentMethod && {
            paymentMethod,
          }),
          ...(paymentCategory && {
            category: paymentCategory,
          }),
          ...(packageId && {
            packageId,
          }),
          ...(status && {
            status,
          }),
          ...(createdAt.startDate &&
            createdAt.endDate && {
              createdAtBetween: [createdAt.startDate, createdAt.endDate],
            }),
        },

        limit: pageLimit,
        skip,
      },
    });
  };

  React.useEffect(() => {
    customGetIncomes();
  }, [filter, getIncomes]);

  return {
    selectedRow,
    setSelectedRow,
    getIncomes,
    customGetIncomes,
    data: dataIncomes?.getIncomes?.data?.map((data, index) => {
      const { firstName, lastName } = data.payerId;
      return {
        ...data,
        _customerName: `${firstName} ${lastName}`,
        no: index + 1,
      };
    }),
    total: dataIncomes?.getIncomes?.total,
  };
};

export default useManageIncomes;
