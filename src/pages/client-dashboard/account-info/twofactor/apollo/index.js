import { gql } from "@apollo/client";

export const MUTATION_TWO_FACTOR = gql`
  mutation Mutation($id: ID!) {
    create2FA(ID: $id) {
      _id
      twoFactorQrCode
      twoFactorSecret
    }
  }
`;
export const MUTATION_TWO_FA_VERIFY = gql`
  mutation Verify2FA($id: ID!, $input: TwoFactorInput!) {
    verify2FA(ID: $id, input: $input) {
      _id
      twoFactorIsEnabled
    }
  }
`;
export const MUTATION_TWO_FA_DISABLE = gql`
  mutation Disable2FA($id: ID!) {
    disable2FA(ID: $id) {
      _id
    }
  }
`;
