import { useLazyQuery } from "@apollo/client";
import React from "react";
import { QUERY_GET_FILE } from "../apollo";

const useFetchFileByMostDownload = ({ user, dataFilter }) => {
  const [getData, { data: dataFetching }] = useLazyQuery(QUERY_GET_FILE, {
    fetchPolicy: "no-cache",
  });

  React.useEffect(() => {
    getData({
      variables: {
        where: {
          isDeleted: 0,
          createdBy: user._id,
          ...(dataFilter.data.filename && {
            filename: dataFilter.data.filename,
          }),
          totalDownload: 0,
        },
        ...(dataFilter.data.skip && {
          skip: dataFilter.data.skip,
        }),
        orderBy: "DOWNLOAD_HIGH_TO_LOW",
        limit: dataFilter.limit,
      },
    });
  }, [dataFilter.data]);

  const data = dataFetching?.files?.data;
  const total = dataFetching?.files?.total;

  const result = {
    data: (data || []).map((data) => {
      return {
        ...data,
      };
    }),
    total,
  };

  return result;
};

export default useFetchFileByMostDownload;
