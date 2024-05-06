import { useLazyQuery } from "@apollo/client";
import React from "react";
import { QUERY_FOLDERS } from "../apollo";

const useFetchFolders = ({ folderUrl, userId }) => {
  const [getData, { data: dataFetching }] = useLazyQuery(QUERY_FOLDERS, {
    fetchPolicy: "no-cache",
  });

  React.useEffect(() => {
    if (userId || folderUrl) {
      getData({
        variables: {
          where: {
            ...(folderUrl && {
              url: folderUrl,
            }),
            ...(folderUrl && {
              createdBy: userId,
            }),
          },
          orderBy: "updatedAt_DESC",
        },
      });
    }
  }, [folderUrl, userId]);

  const data = React.useMemo(() => {
    const [queryData] = dataFetching?.folders?.data || [];
    const queryTotal = dataFetching?.folders?.total || null;
    return {
      data: queryData,
      total: queryTotal,
    };
  }, [dataFetching]);

  return data;
};

export default useFetchFolders;
