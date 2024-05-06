import { gql } from "@apollo/client";

export const QUERY_SERVICE_EMAIL = gql`
  query GetEmails(
    $where: EmailWhereInput
    $skip: Int
    $limit: Int
    $noLimit: Boolean
  ) {
    getEmails(where: $where, skip: $skip, limit: $limit, noLimit: $noLimit) {
      data {
        _id
        name
        email
        status
        template
        type
        createdAt
      }
      total
    }
  }
`;

export const CREATE_SERVICE_EMAIL = gql`
  mutation CreateEmail($input: CreateEmailInput!) {
    createEmail(input: $input) {
      _id
    }
  }
`;

export const UPDATE_SERVICE_EMAIL = gql`
  mutation UpdateEmail($id: ID!, $input: UpdateEmailInput!) {
    updateEmail(ID: $id, input: $input) {
      _id
    }
  }
`;

export const DELETE_SERVICE_EMAIL = gql`
  mutation DeleteEmail($id: ID!) {
    deleteEmail(ID: $id)
  }
`;
