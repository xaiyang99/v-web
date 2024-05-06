import React from "react";
import { useLazyQuery } from "@apollo/client";
import { QUERY_FEEDBACK } from "../apollo";

const useManageStaffs = ({ filter }) => {
  const [getFeedback, { data }] = useLazyQuery(QUERY_FEEDBACK, {
    fetchPolicy: "no-cache",
  });
  const [selectedRow, setSelectedRow] = React.useState([]);
  const { pageLimit, currentPageNumber, comment } = filter;

  const customFeedback = () => {
    const skip = (currentPageNumber - 1) * pageLimit;
    getFeedback({
      variables: {
        orderBy: "createdAt_DESC",
        limit: pageLimit,
        skip,
        where: {
          ...(comment && {
            comment: comment,
          }),
        },
      },
    });
  };

  React.useEffect(() => {
    customFeedback();
  }, [filter, getFeedback]);

  return {
    selectedRow,
    setSelectedRow,
    getFeedback,
    customFeedback,
    data: data?.getFeedback?.data?.map((data, index) => ({
      ...data,
      no: index + 1,
    })),
    total: data?.getFeedback?.total,
  };
};

export default useManageStaffs;
