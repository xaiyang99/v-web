import { gql } from "@apollo/client";

export const QUERY_USERS = gql`
  query GetUser(
    $where: UserWhereInput
    $orderBy: OrderByInput
    $skip: Int
    $limit: Int
  ) {
    getUser(where: $where, orderBy: $orderBy, skip: $skip, limit: $limit) {
      total
      data {
        _id
        packageId {
          _id
        }
        accountId
        lastLoggedInAt
        provider
        firstName
        lastName
        gender
        phone
        email
        username
        newName
        address
        state
        zipCode
        country
        ip
        device
        browser
        status
        profile
        currentDevice
        newDevice
        twoFactorSecret
        twoFactorQrCode
        twoFactorIsEnabled
        twoFactorIsVerified
        createdAt
        updatedAt
        couponType {
          _id
        }
        codeAnonymous
        anonymousExpired
        createdBy {
          _id
          email
        }
      }
    }
  }
`;

export const QUERY_USERS_CUSTOM = gql`
  query GetUser {
    getUser {
      total
      data {
        _id
        firstName
        lastName
        email
      }
    }
  }
`;

export const MUTATION_CREATE_USER = gql`
  mutation CreateUser($body: UserInput!) {
    createUser(body: $body) {
      _id
    }
  }
`;

export const MUTATION_DELETE_USER = gql`
  mutation DeleteUser($id: [ID!]) {
    deleteUser(ID: $id)
  }
`;

export const MUTATION_UPDATE_USER = gql`
  mutation UpdateUser($id: ID!, $body: UpdateUserInput!) {
    updateUser(ID: $id, body: $body) {
      _id
      newName
    }
  }
`;

export const TWO_FA_GENERATE = gql`
  mutation Mutation($id: ID!) {
    create2FA(ID: $id) {
      _id
      twoFactorQrCode
      twoFactorSecret
    }
  }
`;

export const TWO_FA_USER = gql`
  mutation Send2FA($input: UserInput!) {
    send2FA(input: $input) {
      _id
      newName
      email
    }
  }
`;
