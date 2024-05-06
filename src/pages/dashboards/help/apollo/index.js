import { gql } from "@apollo/client";

export const QUERY_HELP = gql`
  query Data(
    $skip: Int
    $limit: Int
    $orderBy: OrderByInput
    $where: HelpWhereInput
  ) {
    getHelp(skip: $skip, limit: $limit, orderBy: $orderBy, where: $where) {
      total
      data {
        _id
        createdAt
        createdBy {
          _id
          email
          username
        }
        description
        image
        name
        status
        updatedAt
      }
    }
  }
`;
export const MUATION_CREATE_HELP = gql`
  mutation CreateHelp($input: HelpInput!) {
    createHelp(input: $input) {
      _id
      image
    }
  }
`;
export const DELETE_HELP = gql`
  mutation DeleteHelp($id: [ID!]) {
    deleteHelp(ID: $id)
  }
`;
export const MUTATION_UPDATE_HELP = gql`
  mutation UpdateHelp($id: ID!, $input: HelpInput!) {
    updateHelp(ID: $id, input: $input) {
      _id
      image
    }
  }
`;
