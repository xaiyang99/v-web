import { useLazyQuery } from "@apollo/client";
import React from "react";
import { QUERY_GET_ADVERTISING } from "../apollo";

const useManageAdvertising = ({ filter }) => {
  const [getAdvertising, { data: dataAdvertising }] = useLazyQuery(
    QUERY_GET_ADVERTISING,
    {
      fetchPolicy: "no-cache",
    },
  );
  const [selectedRow, setSelectedRow] = React.useState([]);

  const customGetAdvertising = async () => {
    const {
      pageLimit,
      role,
      companyName,
      url,
      currentPageNumber,
      status,
      createdAt,
    } = filter;
    const skip = (currentPageNumber - 1) * pageLimit;
    await getAdvertising({
      variables: {
        orderBy: "createdAt_DESC",
        limit: pageLimit,
        skip,
        where: {
          ...(status && {
            status: status,
          }),
          ...(role && {
            role,
          }),
          ...(companyName && {
            companyName,
          }),
          ...(url && {
            url,
          }),
          ...(createdAt.startDate &&
            createdAt.endDate && {
              createdAtBetween: [createdAt.startDate, createdAt.endDate],
            }),
        },
      },
    });
  };

  React.useEffect(() => {
    customGetAdvertising();
  }, [filter]);

  return {
    selectedRow,
    setSelectedRow,
    getAdvertising,
    customGetAdvertising,
    data: dataAdvertising?.getAdvertisement?.data?.map((data, index) => ({
      ...data,
      no: index + 1,
    })),
    total: dataAdvertising?.getAdvertisement?.total,
  };
};

export default useManageAdvertising;
