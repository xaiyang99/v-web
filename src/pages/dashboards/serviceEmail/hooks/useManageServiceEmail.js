import { useLazyQuery } from "@apollo/client";
import { QUERY_SERVICE_EMAIL } from "../apollo";
import { useEffect } from "react";

function useManageServiceEmail({ filter }) {
  const { search, pageRow, pageLimit } = filter;
  const [getServiceEmail, { data: dataService, refetch: fetchingData }] =
    useLazyQuery(QUERY_SERVICE_EMAIL);
  async function fetchData() {
    try {
      await getServiceEmail({
        variables: {
          //   limit: pageLimit,
        },
      });
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    fetchData();
  }, [filter]);

  return {
    data: (dataService?.getEmails?.data || [])?.map((item, index) => {
      return {
        ...item,
        index: index + 1,
      };
    }),
    total: dataService?.getEmails?.total || 0,
    fetchingData,
  };
}

export default useManageServiceEmail;
