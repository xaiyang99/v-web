import { useLazyQuery } from "@apollo/client";
import React from "react";
import { QUERY_INVOICES } from "../apollo";

const useManageInvoices = ({ filter }) => {
  const [getEInvoices, { data: dataEInvoices, refetch: refetchEInvoices }] =
    useLazyQuery(QUERY_INVOICES, {
      fetchPolicy: "no-cache",
    });
  const [selectedRow, setSelectedRow] = React.useState([]);

  const customGetEInvoices = () => {
    const { pageLimit, currentPageNumber, createdAt, packageId, packageName } =
      filter;
    const skip = (currentPageNumber - 1) * pageLimit;

    getEInvoices({
      variables: {
        orderBy: "createdAt_DESC",
        where: {
          ...(packageId && {
            packageId,
          }),
          ...(packageName && {
            packageName,
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
    customGetEInvoices();
  }, [filter, getEInvoices]);

  return {
    selectedRow,
    setSelectedRow,
    getEInvoices,
    customGetEInvoices,
    data: dataEInvoices?.getInvoice?.data?.map((data, index) => {
      return {
        ...data,
        no: index + 1,
      };
    }),
    total: dataEInvoices?.getInvoice?.total,
  };
};

export default useManageInvoices;
