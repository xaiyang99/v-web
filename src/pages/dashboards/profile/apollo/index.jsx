import { gql } from "@apollo/client";

export const QUERY_STAFF_ACCOUNT = gql`
  query QueryStaffs($where: StaffWhereInput) {
    queryStaffs(where: $where) {
      total
      data {
        _id
        firstname
        lastname
        gender
        email
        username
        newName
        birthday
        status
        phone
        position
        createdAt
        addProfile
        village
        district
        address
        twoFactorIsEnabled
      }
    }
  }
`;

export const MUTATION_UPDATE_STAFF_PROFILE = gql`
  mutation UpdateStaff($data: StaffInput!, $where: StaffWhereInput!) {
    updateStaff(data: $data, where: $where) {
      _id
    }
  }
`;

export const MUTATION_CHANGE_PASSWORD = gql`
  mutation StaffChangePassword($id: ID!, $body: ChangePasswordInput!) {
    staffChangePassword(ID: $id, body: $body)
  }
`;

export const MUTATION_CREATE_TWO_FA = gql`
  mutation CreateTwoFA($id: ID!) {
    createTwoFA(ID: $id) {
      _id
      twoFactorQrCode
      twoFactorSecret
    }
  }
`;

export const MUTATION_TWO_FA_DISABLE = gql`
  mutation DisableTwoFA($id: ID!) {
    disableTwoFA(ID: $id) {
      _id
    }
  }
`;

export const MUTATION_TWO_FA_VERIFY = gql`
  mutation VerifyTwoFA($id: ID!, $code: String!) {
    verifyTwoFA(ID: $id, code: $code) {
      _id
      twoFactorIsEnabled
    }
  }
`;
