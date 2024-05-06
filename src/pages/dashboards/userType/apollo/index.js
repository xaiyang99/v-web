import { gql } from "@apollo/client";

export const MUTATION_USER_TYPE = gql`
  mutation CreateUserType($body: UserTypeInput!) {
    createUserType(body: $body) {
      _id
    }
  }
`;

export const QUERY_USER_TYPE = gql`
  query Data($where: UserTypeWhereInput) {
    getUserType(where: $where) {
      data {
        _id
        name
        status
        updatedAt
        createdBy {
          username
          _id
          firstName
          email
        }
        createdAt
      }
    }
  }
`;

export const DELETE_USER_TYPE = gql`
  mutation DeleteUserType($id: [ID!]) {
    deleteUserType(ID: $id)
  }
`;

export const MUTATION_UPDATE_USER_TYPE = gql`
  mutation UpdateUserType($body: UserTypeInput!, $id: ID!) {
    updateUserType(body: $body, ID: $id)
  }
`;
