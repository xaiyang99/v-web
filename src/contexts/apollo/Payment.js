import { gql } from "@apollo/client";

export const QUERY_PAYMENTS = gql`
  query Data(
    $where: PaymentWhereInput
    $orderBy: OrderByInput
    $skip: Int
    $limit: Int
    $noLimit: Boolean
  ) {
    getPayments(
      where: $where
      orderBy: $orderBy
      skip: $skip
      limit: $limit
      noLimit: $noLimit
    ) {
      data {
        _id
        paymentId
        category
        paymentMethod
        amount
        description
        countBuyPayment
        status
        createdAt
        updatedAt
        orderedAt
        expired
      }
    }
  }
`;
