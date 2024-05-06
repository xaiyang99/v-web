import { gql } from "@apollo/client";

export const USER_SIGNUP = gql`
  mutation Signup($input: UserInput!) {
    signup(input: $input) {
      _id
    }
  }
`;
