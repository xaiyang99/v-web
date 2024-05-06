import React from "react";
import { useLazyQuery } from "@apollo/client";
import { QUERY_HELP } from "../apollo";
const useManageHelp = ({ filter }) => {
  const [listHelp, { data: listHelpData }] = useLazyQuery(QUERY_HELP, {
    fetchPolicy: "no-cache",
  });
  const { pageLimit, currentPageNumber, title } = filter;
  const [selectedRow, setSelectedRow] = React.useState([]);
  const customQueryHelp = () => {
    const skip = (currentPageNumber - 1) * pageLimit;
    listHelp({
      variables: {
        skip,
        orderBy: "createdAt_DESC",
        limit: pageLimit,
        where: {
          ...(title && {
            name: title,
          }),
        },
      },
    });
  };
  React.useEffect(() => {
    customQueryHelp();
  }, [filter, listHelp]);

  return {
    selectedRow,
    setSelectedRow,
    customQueryHelp,
    listHelp,
    data: listHelpData?.getHelp?.data.map((data, index) => ({
      ...data,
      no: index + 1,
    })),
    total: listHelpData?.getHelp?.total,
  };
};
export default useManageHelp;
