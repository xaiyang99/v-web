import { useLazyQuery } from "@apollo/client";
import React from "react";
import { QUERY_ADVERTISEMENT } from "../apollo";

const useAdvertisement = (props) => {
  const [getAdvertisement, { data: isAdvertisement }] = useLazyQuery(
    QUERY_ADVERTISEMENT,
    {
      fetchPolicy: "no-cache",
    }
  );

  const customeAdvertisement = async () => {
    await getAdvertisement({
      variables: {
        where: {
          createdAtBetween: [props?.endDate, props?.startDate],
        },
      },
    });
  };
  React.useEffect(() => {
    customeAdvertisement();
  }, [getAdvertisement, props]);

  return {
    customeAdvertisement: customeAdvertisement,
    data: isAdvertisement?.getAdvertisement?.data.map((data, index) => ({
      ...data,
      no: index + 1,
    })),
    total: isAdvertisement?.getAdvertisement?.total || 0,
  };
};

export default useAdvertisement;
