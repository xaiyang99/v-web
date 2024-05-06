import { useMutation } from "@apollo/client";
import { UPDATE_COUPON } from "../apollo";
const useUpdateCoupon = (id, status) => {
  const [updatecoupon] = useMutation(UPDATE_COUPON);

  const handleUpdateStatus = () => {
    updatecoupon({
      variables: {
        where: { _id: parseInt(id) },
        data: {
          status: status,
        },
      },
    });
  };

  return handleUpdateStatus;
};
export default useUpdateCoupon;
