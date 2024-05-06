import { useLazyQuery } from "@apollo/client";
import React from "react";
import { QUERY_ANNOUCEMENT } from "../apollo";

const useAnnoucement = (props) => {
  const [getAnnoucment, { data: isAnnoucment }] = useLazyQuery(
    QUERY_ANNOUCEMENT,
    {
      fetchPolicy: "no-cache",
    }
  );
  const customAnnoucement = async () => {
    await getAnnoucment({
      variables: {
        where: {
          status: "published",
          createdAtBetween: [props?.endDate, props?.startDate],
        },
      },
    });
  };
  React.useEffect(() => {
    customAnnoucement();
  }, [getAnnoucment, props]);

  return {
    customAnnoucement: customAnnoucement,
    data: isAnnoucment?.getAnnouncements?.data.map((data, index) => ({
      ...data,
      no: index + 1,
    })),
    total: isAnnoucment?.getAnnouncements?.total || 0,
  };
};

export default useAnnoucement;
