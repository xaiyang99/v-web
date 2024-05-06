import { gql } from "@apollo/client";

export const QUERY_FAQ = gql`
  query Faqs(
    $limit: Int
    $skip: Int
    $orderBy: OrderByFolderAndFileInput
    $where: FaqWhereInput
  ) {
    faqs(limit: $limit, skip: $skip, orderBy: $orderBy, where: $where) {
      total
      data {
        _id
        question
        answer
        display
        createdBy {
          email
        }
        createdAt
        updatedAt
      }
    }
  }
`;

export const CREATE_FAQ = gql`
  mutation CreateFaq($data: FaqInput!) {
    createFaq(data: $data) {
      _id
    }
  }
`;

export const DELETE_FAQ = gql`
  mutation DeleteFaq($where: FaqWhereDeleteInput!) {
    deleteFaq(where: $where) {
      _id
    }
  }
`;

export const UPDATE_FAQS = gql`
  mutation UpdateFaq($data: FaqInput!, $where: FaqWhereOneInput!) {
    updateFaq(data: $data, where: $where) {
      _id
    }
  }
`;
