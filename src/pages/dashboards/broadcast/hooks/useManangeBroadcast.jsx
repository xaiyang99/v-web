import { useLazyQuery } from "@apollo/client";
import React from "react";
import { QUERY_BROADCAST } from "../apollo";

const useManangeBroadcast = ({ filter }) => {
  const [listBroadcast, { data: isBroadcast }] = useLazyQuery(QUERY_BROADCAST, {
    fetchPolicy: "no-cache",
  });
  const [selectedRow, setSelectedRow] = React.useState([]);
  const { pageLimit, currentPageNumber, title, status, createdAt } = filter;
  const customQueryAnnounCement = () => {
    const skip = (currentPageNumber - 1) * pageLimit;
    listBroadcast({
      variables: {
        skip,
        orderBy: "createdAt_DESC",
        limit: pageLimit,
        where: {
          ...(title && {
            title: title,
          }),
          ...(status && {
            status,
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
    customQueryAnnounCement();
  }, [filter, listBroadcast]);

  return {
    selectedRow,
    setSelectedRow,
    customQueryAnnounCement,

    data: isBroadcast?.getBroadcasts?.data?.map((data, index) => ({
      ...data,
      no: index + 1,
    })),
    total: isBroadcast?.getBroadcasts?.total,
  };
};

export default useManangeBroadcast;
