import { useLazyQuery } from "@apollo/client";
import React from "react";
import { QUERY_TYPE_COUPON } from "../apollo";

const useManageTypeCoupon = ({ filter }) => {
  const [listTypeCoupon, { data: isTypeCoupon }] = useLazyQuery(
    QUERY_TYPE_COUPON,
    {
      fetchPolicy: "no-cache",
    }
  );
  const [selectedRow, setSelectedRow] = React.useState([]);
  const { pageLimit, currentPageNumber, title, createdAt } = filter;

  const customQueryTypeCoupon = () => {
    const skip = (currentPageNumber - 1) * pageLimit;
    listTypeCoupon({
      variables: {
        skip,
        orderBy: "createdAt_DESC",
        limit: pageLimit,
        where: {
          ...(title && { typeCoupon: title }),
          ...(createdAt.startDate &&
            createdAt.endDate && {
              createdAtBetween: [createdAt.startDate, createdAt.endDate],
            }),
        },
      },
    });
  };
  React.useEffect(() => {
    customQueryTypeCoupon();
  }, [filter, listTypeCoupon]);

  return {
    selectedRow,
    setSelectedRow,
    customQueryTypeCoupon,
    data: isTypeCoupon?.typecoupons?.data?.map((data, index) => ({
      ...data,
      no: index + 1,
    })),
    total: isTypeCoupon?.typecoupons?.total,
  };
};
export default useManageTypeCoupon;
