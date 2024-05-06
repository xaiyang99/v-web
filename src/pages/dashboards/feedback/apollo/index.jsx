import { gql } from "@apollo/client";
export const CREATE_FEEDBACK_MUTATION = gql`
  mutation CreateFeedback($input: FeedbackInput!) {
    createFeedback(input: $input) {
      _id
    }
  }
`;

export const QUERY_FEEDBACK = gql`
  query Data(
    $where: FeedbackWhereInput
    $skip: Int
    $limit: Int
    $orderBy: OrderByInput
  ) {
    getFeedback(where: $where, skip: $skip, limit: $limit, orderBy: $orderBy) {
      total
      data {
        _id
        rating
        comment
        designRating
        designComment
        performanceRating
        performanceComment
        serviceRating
        serviceComment
        createdAt
        updatedAt
        createdBy {
          _id
          email
        }
      }
    }
  }
`;

export const DELETE_FEEDBACK = gql`
  mutation DeleteFeedback($id: [ID!]) {
    deleteFeedback(ID: $id)
  }
`;
