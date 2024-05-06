import { gql } from "@apollo/client";
export const QUERY_FEATURE_PACKAGE = gql`
  query Featurpackage(
    $noLimit: Boolean
    $limit: Int
    $skip: Int
    $orderBy: OrderByInput
    $where: FeaturpackageWhereInput
  ) {
    featurpackage(
      noLimit: $noLimit
      limit: $limit
      skip: $skip
      orderBy: $orderBy
      where: $where
    ) {
      total
      data {
        _id
        title
        subtitle
        detial
        status
        createdAt
        updatedAt
        createdBy {
          _id
          firstName
          lastName
        }
      }
    }
  }
`;
export const DELETE_FEATURE_PACKAGE = gql`
  mutation DeleteFeaturpackage($where: FeaturpackageWhereInputOne!) {
    deleteFeaturpackage(where: $where) {
      _id
    }
  }
`;
export const CREATE_FEATURE_PACKAGE = gql`
  mutation CreateFeaturpackage($data: FeaturpackageInput!) {
    createFeaturpackage(data: $data) {
      _id
    }
  }
`;
export const UPDATE_FEATURE_PACKAGE = gql`
  mutation UpdateFeaturpackage(
    $data: FeaturpackageInput!
    $where: FeaturpackageWhereInputOne!
  ) {
    updateFeaturpackage(data: $data, where: $where) {
      _id
    }
  }
`;
