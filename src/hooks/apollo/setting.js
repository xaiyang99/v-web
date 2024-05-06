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
