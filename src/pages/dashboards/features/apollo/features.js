import { gql } from "@apollo/client";

export const QUERY_FEATURES = gql`
  query Data {
    features {
      data {
        updatedBy {
          _id
          username
          email
        }
        updatedAt
        title
        image
        createdBy {
          _id
          username
          email
        }
        _id
        createdAt
        Content1
      }
    }
  }
`;
export const MUTATION_CREATE_FEATURE = gql`
  mutation CreateFeatures($data: FeaturesInput!) {
    createFeatures(data: $data) {
      _id
    }
  }
`;
export const DELETE_FEATURE = gql`
  mutation DeleteFeatures($id: [ID!]!) {
    deleteFeatures(ID: $id)
  }
`;
export const UPDATE_FEATURE = gql`
  mutation UpdateFeatures(
    $data: FeaturesInput!
    $where: FeaturesWhereOneInput!
  ) {
    updateFeatures(data: $data, where: $where) {
      _id
    }
  }
`;
