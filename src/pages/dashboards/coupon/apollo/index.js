import { gql } from "@apollo/client";

export const QUERY_TYPE_COUPON = gql`
  query Typecoupons(
    $where: TypecouponWhereInput
    $orderBy: OrderByFolderAndFileInput
    $skip: Int
    $limit: Int
  ) {
    typecoupons(where: $where, orderBy: $orderBy, skip: $skip, limit: $limit) {
      total
      data {
        _id
        actionCoupon
        createdAt
        expird
        startDate
        status
        typeCoupon
        unit
        updatedAt
      }
    }
  }
`;
export const QUERY_COUPON = gql`
  query Coupons(
    $where: CouponWhereInput
    $orderBy: OrderByFolderAndFileInput
    $limit: Int
    $skip: Int
  ) {
    coupons(where: $where, orderBy: $orderBy, limit: $limit, skip: $skip) {
      data {
        _id
        amount
        code
        status
        createdAt
        createdBy {
          _id
        }
        typeCouponID {
          _id
          actionCoupon
          startDate
          status
          typeCoupon
          unit
          updatedAt
          expird
          createdAt
        }
        updatedAt
        updatedBy {
          _id
        }
      }
      total
    }
  }
`;
export const DELETE_TYPE_COUPON = gql`
  mutation DeleteTypecoupon($where: TypecouponWhereOneInput!) {
    deleteTypecoupon(where: $where) {
      _id
    }
  }
`;
export const DELETE_COUPON = gql`
  mutation DeleteCoupon($where: CouponWhereOneInput!) {
    deleteCoupon(where: $where) {
      _id
    }
  }
`;
export const CREATE_COUPON = gql`
  mutation CreateCoupon($data: CouponInput!) {
    createCoupon(data: $data) {
      status
    }
  }
`;
export const CREATE_TYPE_COUPON = gql`
  mutation CreateTypecoupon($data: TypecouponInput!) {
    createTypecoupon(data: $data) {
      _id
    }
  }
`;
export const UPDATE_COUPON = gql`
  mutation UpdateCoupon($where: CouponWhereOneInput!, $data: CouponInput!) {
    updateCoupon(where: $where, data: $data) {
      _id
    }
  }
`;

export const UPDATE_TYPE_COUPON = gql`
  mutation UpdateTypecoupon(
    $data: TypecouponInput!
    $where: TypecouponWhereOneInput!
  ) {
    updateTypecoupon(data: $data, where: $where) {
      _id
    }
  }
`;

export const SEND_COUPON_CODE = gql`
  mutation SendCodeToCustomer($data: SendCodeInput!) {
    sendCodeToCustomer(data: $data) {
      status
    }
  }
`;
