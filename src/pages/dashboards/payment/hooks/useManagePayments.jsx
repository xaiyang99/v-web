import { useLazyQuery } from "@apollo/client";
import React from "react";
import { QUERY_PAYMENTS } from "../apollo";

const useManagePayments = ({ filter }) => {
  const [getPayments, { data: dataPayments }] = useLazyQuery(QUERY_PAYMENTS, {
    fetchPolicy: "no-cache",
  });
  const [selectedRow, setSelectedRow] = React.useState([]);

  const customGetPayments = () => {
    const {
      pageLimit,
      status,
      currentPageNumber,
      paymentMethod,
      paymentCategory,
      createdAt,
      packageId,
      packageName,
    } = filter;
    const skip = (currentPageNumber - 1) * pageLimit;

    getPayments({
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
          ...(packageName && {
            name: packageName,
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
    customGetPayments();
  }, [filter, getPayments]);

  return {
    selectedRow,
    setSelectedRow,
    getPayments,
    customGetPayments,
    data: dataPayments?.getPayments?.data?.map((data, index) => {
      const { firstName, lastName } = data.payerId;
      return {
        ...data,
        _customerName: `${firstName} ${lastName}`,
        no: index + 1,
      };
    }),
    total: dataPayments?.getPayments?.total,
  };
};

export default useManagePayments;
