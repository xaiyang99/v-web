import { useLazyQuery } from "@apollo/client";
import React from "react";
import useDeepEqualEffect from "../../../../hooks/useDeepEqualEffect";
import { QUERY_ALL_FILE_CATEGORIES } from "../apollo";

const useFetchFiles = ({ filter }) => {
  const [getData, { data: dataFetching, loading }] = useLazyQuery(
    QUERY_ALL_FILE_CATEGORIES,
    {
      fetchPolicy: "no-cache",
    },
  );
  const [isDataFound, setDataFound] = React.useState(null);

  const customgetFiles = () => {
    getData({
      variables: {
        where: {
          createdBy: parseInt(filter.user_id),
          fileType: filter.file_type || "",
          status: "active",
        },
        limit: filter.limit,
        skip: filter.skip,
      },
    });
  };

  const customGridFile = () => {
    getData({
      variables: {
        where: {
          createdBy: parseInt(filter.user_id),
          fileType: filter.file_type || "",
          status: "active",
        },
        limit: filter.limitScroll || 10,
      },
    });
  };

  useDeepEqualEffect(() => {
    if (filter?.toggle === "list") {
      customgetFiles();
    } else {
      customGridFile();
    }
  }, [filter]);

  const data = React.useMemo(() => {
    const queryData = dataFetching?.getFileCategoryDetails?.data || [];
    const queryTotal = dataFetching?.getFileCategoryDetails?.total || 0;
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
      customGridFile,
      isDataFound,
    };
  }, [dataFetching, isDataFound]);

  return data;
};

export default useFetchFiles;
