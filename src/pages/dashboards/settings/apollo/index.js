import { gql } from "@apollo/client";

export const QUERY_SETTING = gql`
  query getGeneralSetting($where: General_settingsWhereInput) {
    general_settings(where: $where) {
      data {
        _id
        title
        action
        groupName
        status
        productKey
        categoryKey
      }
    }
  }
`;

export const MUTATION_CREATE_SETTING = gql`
  mutation CreateGeneral_settings($data: General_settingsInput!) {
    createGeneral_settings(data: $data) {
      _id
    }
  }
`;

export const MUTATION_UPDATE_SETTING = gql`
  mutation UpdateGenerateSetting(
    $data: General_settingsInput!
    $where: General_settingsWhereOneInput!
  ) {
    updateGeneral_settings(data: $data, where: $where) {
      _id
    }
  }
`;
