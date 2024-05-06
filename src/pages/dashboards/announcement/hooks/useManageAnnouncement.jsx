import { useLazyQuery } from "@apollo/client";
import { QUERY_ANOUNCEMENT } from "../apollo";
import React from "react";

const useManageAnnouncement = ({ filter }) => {
  const [listAnouncement, { data: isAnouncement }] = useLazyQuery(
    QUERY_ANOUNCEMENT,
    {
      fetchPolicy: "no-cache",
    }
  );
  const [selectedRow, setSelectedRow] = React.useState([]);
  const { pageLimit, currentPageNumber, title, status, createdAt } = filter;

  const customQueryAnounCement = () => {
    const skip = (currentPageNumber - 1) * pageLimit;
    listAnouncement({
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
    customQueryAnounCement();
  }, [filter, listAnouncement]);

  return {
    selectedRow,
    setSelectedRow,
    customQueryAnounCement,
    listAnouncement,
    data: isAnouncement?.getAnnouncements?.data?.map((data, index) => ({
      ...data,
      no: index + 1,
    })),
    total: isAnouncement?.getAnnouncements?.total,
  };
};
export default useManageAnnouncement;
