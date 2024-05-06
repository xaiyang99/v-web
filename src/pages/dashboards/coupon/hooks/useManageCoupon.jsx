import { useLazyQuery } from "@apollo/client";
import { QUERY_COUPON } from "../apollo";
import React from "react";

const useManageCoupon = ({ filter }) => {
  const [listCoupon, { data: isCoupon }] = useLazyQuery(QUERY_COUPON, {
    fetchPolicy: "no-cache",
  });
  const [selectedRow, setSelectedRow] = React.useState([]);
  const { pageLimit, currentPageNumber, id, title, status, createdAt } = filter;
  const customQueryCoupon = () => {
    const skip = (currentPageNumber - 1) * pageLimit;
    listCoupon({
      variables: {
        skip,
        orderBy: "createdAt_DESC",
        limit: pageLimit,
        where: {
          ...(id && {
            typeCouponID: id,
          }),
          ...(title && {
            code: title,
          }),
          ...(status && {
            status,
          }),
          ...(createdAt.startDate &&
            createdAt.endDate && {
              createdAtBetween: [createdAt.startDate, createdAt.endDate],
            }),
        },
      },
    });
  };
  React.useEffect(() => {
    customQueryCoupon();
  }, [listCoupon, filter]);
  return {
    selectedRow,
    setSelectedRow,
    customQueryCoupon,
    data: isCoupon?.coupons?.data?.map((data, index) => ({
      ...data,
      no: index + 1,
    })),
    total: isCoupon?.coupons?.total || 0,
  };
};
export default useManageCoupon;
