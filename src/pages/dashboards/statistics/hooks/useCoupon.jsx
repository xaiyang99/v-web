import { useLazyQuery } from "@apollo/client";
import React from "react";
import { QUERY_COUPON } from "../apollo";

const useCoupon = (props) => {
  const [getCoupon, { data: isCoupon }] = useLazyQuery(QUERY_COUPON, {
    fetchPolicy: "no-cache",
  });
  const customCoupon = async () => {
    await getCoupon({
      variables: {
        where: {
          status: "used",
          updatedAtBetween: [props?.endDate, props?.startDate],
        },
      },
    });
  };
  React.useEffect(() => {
    customCoupon();
  }, [getCoupon, props]);

  return {
    customCoupon: customCoupon,
    data: isCoupon?.coupons?.data.map((data, index) => ({
      ...data,
      no: index + 1,
    })),
    total: isCoupon?.coupons?.total || 0,
  };
};

export default useCoupon;
