import { useLazyQuery } from "@apollo/client";
import React from "react";
import { QUERY_COUPON } from "../apollo";

const useTotalCoupon = ({ filter }) => {
  const [listCoupon, { data: isCoupon }] = useLazyQuery(QUERY_COUPON, {
    fetchPolicy: "no-cache",
  });
  const [selectedRow, setSelectedRow] = React.useState([]);
  const { id } = filter;
  const customQueryCoupon = () => {
    listCoupon({
      variables: {
        where: { typeCouponID: id },
      },
    });
  };
  React.useEffect(() => {
    customQueryCoupon();
  }, [filter, listCoupon]);
  return {
    selectedRow,
    setSelectedRow,
    customQueryCoupon,
    data: isCoupon?.coupons?.data?.map((data, index) => ({
      ...data,
      no: index + 1,
    })),
    total: isCoupon?.coupons?.data?.length || 0,
  };
};
export default useTotalCoupon;
