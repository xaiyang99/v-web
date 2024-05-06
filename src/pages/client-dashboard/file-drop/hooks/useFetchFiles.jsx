import { useLazyQuery } from "@apollo/client";
import React from "react";
import useDeepEqualEffect from "../../../../hooks/useDeepEqualEffect";
import { QUERY_ALL_FILES_DROP } from "../apollo";

const useFetchFiles = ({ filter }) => {
  const [isDataFound, setDataFound] = React.useState(null);
  const [getData, { data: dataFetching, loading }] = useLazyQuery(
    QUERY_ALL_FILES_DROP,
    {
      fetchPolicy: "no-cache",
    }
  );

  const customgetFiles = () => {
    getData({
      variables: {
        where: {
          dropUrl: filter.url,
          status: "active",
        },
      },
    });
  };

  useDeepEqualEffect(() => {
    customgetFiles();
  }, [filter]);

  const data = React.useMemo(() => {
    const queryData = dataFetching?.files?.data || [];
    const queryTotal = dataFetching?.files?.total || null;
    if (queryData !== undefined) {
      if (queryData.length > 0) {
        setDataFound(true);
      } else {
        setDataFound(false);
      }
    }
    return {
      data: queryData,
      total: queryTotal,
      loading,
      customgetFiles,
      isDataFound,
    };
  }, [dataFetching, isDataFound]);

  return data;
};

export default useFetchFiles;
