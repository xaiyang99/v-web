import { gql } from "@apollo/client";
export const QUERY_MESSAGE = gql`
  query GetContact(
    $noLimit: Boolean
    $limit: Int
    $skip: Int
    $orderBy: OrderByInput
    $where: ContactWhereInput
  ) {
    getContact(
      noLimit: $noLimit
      limit: $limit
      skip: $skip
      orderBy: $orderBy
      where: $where
    ) {
      total
      data {
        _id
        name
        email
        message
        createdAt
        updatedAt
      }
    }
  }
`;
export const DELETE_CONTACT = gql`
  mutation DeleteContact($id: [ID!]) {
    deleteContact(ID: $id)
  }
`;
