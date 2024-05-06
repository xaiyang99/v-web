import { gql } from "@apollo/client";

export const QUERY_FAQ = gql`
  query Data(
    $where: FaqWhereInput
    $orderBy: OrderByFolderAndFileInput
    $skip: Int
    $limit: Int
    $noLimit: Boolean
  ) {
    faqs(
      where: $where
      orderBy: $orderBy
      skip: $skip
      limit: $limit
      noLimit: $noLimit
    ) {
      data {
        _id
        question
        answer
        createdAt
        updatedAt
      }
      total
    }
  }
`;
