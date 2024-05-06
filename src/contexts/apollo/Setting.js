import { gql } from "@apollo/client";

export const QUERY_SETTING = gql`
  query getGeneralSetting(
    $noLimit: Boolean
    $where: General_settingsWhereInput
  ) {
    general_settings(noLimit: $noLimit, where: $where) {
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
