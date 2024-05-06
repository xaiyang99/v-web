import { gql } from "@apollo/client";

export const QUERY_COMPANY = gql`
  query GetPartner($where: PartnerWhereInput) {
    getPartner(where: $where) {
      total
      data {
        _id
        name
        email
        phone
        address
        status
        createdBy {
          _id
          firstName
          lastName
        }
        createdAt
      }
    }
  }
`;

export const MUTATION_CREATE_COMPANY = gql`
  mutation CreatePartner($input: PartnerInput!) {
    createPartner(input: $input) {
      _id
    }
  }
`;

export const MUTATION_UPDATE_COMPANY = gql`
  mutation UpdatePartner($input: PartnerInput!, $id: ID!) {
    updatePartner(input: $input, ID: $id)
  }
`;

export const MUTATION_DELETE_COMPANY = gql`
  mutation DeletePartner($id: [ID!]) {
    deletePartner(ID: $id)
  }
`;
