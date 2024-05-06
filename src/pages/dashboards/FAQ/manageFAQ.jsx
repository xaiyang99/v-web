import React from "react";
import { useLazyQuery } from "@apollo/client";
import { QUERY_FAQ } from "./apollo/faqs";

function ManageFAQ({ filter }) {
  const [getFAQ, { data }] = useLazyQuery(QUERY_FAQ, {
    fetchPolicy: "no-cache",
  });
  const [selectedRow, setSelectedRow] = React.useState([]);
  const { pageLimit, currentPageNumber, status, search } = filter;

  const customeFAQ = () => {
    const skip = (currentPageNumber - 1) * pageLimit;
    getFAQ({
      variables: {
        orderBy: "createdAt_ASC",
        limit: pageLimit,
        skip,
        where: {
          ...(status && { display: status }),
          ...(search && { question: search }),
        },
      },
    });
  };

  React.useEffect(() => {
    customeFAQ();
  }, [filter, getFAQ]);

  return {
    selectedRow,
    setSelectedRow,
    getFAQ,
    customeFAQ,
    data: data?.faqs?.data?.map((value, index) => ({
      ...value,
      no: index + 1,
    })),
    total: data?.faqs?.total,
  };
}

export default ManageFAQ;
