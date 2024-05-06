import { gql } from "@apollo/client";

export const MUTATION_CREATE_FEEDBACK = gql`
  mutation CreateFeedback($input: FeedbackInput!) {
    createFeedback(input: $input) {
      _id
    }
  }
`;
