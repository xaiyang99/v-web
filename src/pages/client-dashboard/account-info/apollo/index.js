import { gql } from "@apollo/client";

export const QUERY_USER_ACCOUNT = gql`
  query Data($where: UserWhereInput) {
    getUser(where: $where) {
      data {
        _id
        firstName
        lastName
        gender
        email
        username
        newName
        device
        browser
        twoFactorIsEnabled
        twoFactorIsVerified
        twoFactorSecret
        twoFactorQrCode
        profile
        updatedAt
        companyID {
          companyName
          _id
        }
        state
        status
        zipCode
        country
        phone
        address
      }
    }
  }
`;
export const MUTATION_UPDATE_USER = gql`
  mutation UpdateUser($body: UpdateUserInput!, $id: ID!) {
    updateUser(body: $body, ID: $id) {
      _id
    }
  }
`;
export const UPDATE_COMPANY = gql`
  mutation UpdateCompany($data: CompanyInput!, $where: CompanyWhereOneInput!) {
    updateCompany(data: $data, where: $where) {
      _id
    }
  }
`;
export const MUATION_ADD_COMPANY = gql`
  mutation CreateCompany($data: CompanyInput!) {
    createCompany(data: $data) {
      _id
    }
  }
`;

export const CHANGE_USER_PASSWORD = gql`
  mutation ChangePassword($id: ID!, $body: ChangePasswordInput!) {
    changePassword(ID: $id, body: $body)
  }
`;

export const QUERY_LOG = gql`
  query GetLogs($where: LogParamsInput, $limit: Int, $orderBy: OrderByInput) {
    getLogs(where: $where, limit: $limit, orderBy: $orderBy) {
      total
      data {
        _id
        name
        status
        description
        createdAt
        refreshID
      }
    }
  }
`;
