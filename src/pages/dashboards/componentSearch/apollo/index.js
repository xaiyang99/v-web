import { gql } from "@apollo/client";
export const QUERY_USER_SEARCH = gql`
  query Data(
    $noLimit: Boolean
    $limit: Int
    $skip: Int
    $orderBy: OrderByInput
    $where: UserWhereInput
  ) {
    getUser(
      noLimit: $noLimit
      limit: $limit
      skip: $skip
      orderBy: $orderBy
      where: $where
    ) {
      data {
        _id
        firstName
        lastName
      }
    }
  }
`;
export const QUERY_FILES = gql`
  query Files(
    $noLimit: Boolean
    $limit: Int
    $skip: Int
    $orderBy: OrderByInput
    $where: FilesWhereInput
  ) {
    files(
      noLimit: $noLimit
      limit: $limit
      skip: $skip
      orderBy: $orderBy
      where: $where
    ) {
      total
      data {
        _id
        filename
      }
    }
  }
`;
export const QUERY_SEARCH_PACKAGE = gql`
  query Package(
    $noLimit: Boolean
    $limit: Int
    $skip: Int
    $orderBy: OrderByInput
    $where: PackageWhereInput
  ) {
    package(
      noLimit: $noLimit
      limit: $limit
      skip: $skip
      orderBy: $orderBy
      where: $where
    ) {
      data {
        _id
        title
      }
    }
  }
`;
