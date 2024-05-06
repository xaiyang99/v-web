import React from "react";
import { useLazyQuery } from "@apollo/client";
import { QUERY_SEO } from "../apollo";

function useManageSEO({ filter }) {
  const [getSEO, { data }] = useLazyQuery(QUERY_SEO, {
    fetchPolicy: "no-cache",
  });
  const [selectedRow, setSelectedRow] = React.useState([]);
  const { page } = filter;

  const customSEO = () => {
    getSEO({
      variables: {
        orderBy: "createdAt_DESC",
        where: {
          ...(page && { pageId: page }),
        },
      },
    });
  };

  React.useEffect(() => {
    customSEO();
  }, [filter, getSEO]);

  return {
    selectedRow,
    setSelectedRow,
    getSEO,
    customSEO,
    data: data?.getSEO?.data?.map((data, index) => ({
      ...data,
      no: index + 1,
    })),
  };
}

export default useManageSEO;
