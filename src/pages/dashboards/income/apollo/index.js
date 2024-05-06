import { gql } from "@apollo/client";

export const QUERY_INCOMES = gql`
  query GetIncomes(
    $noLimit: Boolean
    $limit: Int
    $skip: Int
    $orderBy: OrderByInput
    $where: PaymentWhereInput
  ) {
    getIncomes(
      noLimit: $noLimit
      limit: $limit
      skip: $skip
      orderBy: $orderBy
      where: $where
    ) {
      total
      totalAmount
      data {
        _id
        paymentId
        packageId {
          _id
        }
        payerId {
          _id
          accountId
          provider
          firstName
          lastName
          gender
          phone
          email
          username
          newName
          address
          state
          zipCode
          country
          ip
          device
          browser
          status
        }
        paymentMethod
        amount
        description
        status
        createdAt
        updatedAt
        orderedAt
      }
    }
  }
`;

export const MUTATION_DELETE_INCOME = gql`
  mutation DeleteIncome($id: [ID!]) {
    deleteIncome(ID: $id)
  }
`;
