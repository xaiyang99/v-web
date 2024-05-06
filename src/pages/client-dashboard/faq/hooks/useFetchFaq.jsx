import { useLazyQuery } from "@apollo/client";
import { QUERY_FAQ } from "../apollo";
import React from "react";

const useFetchFaq = () => {
  const [getData, { data: dataFetching }] = useLazyQuery(QUERY_FAQ, {
    fetchPolicy: "no-cache",
  });

  React.useEffect(() => {
    getData({
      variables: {
        where: {
          display: "back",
        },
      },
    });
  }, []);

  const data = React.useMemo(() => {
    const queryData = dataFetching?.faqs?.data || [];
    const queryTotal = dataFetching?.faqs?.total || null;
    return {
      data: queryData,
      total: queryTotal,
    };
  }, [dataFetching]);

  return data;
};

export default useFetchFaq;
