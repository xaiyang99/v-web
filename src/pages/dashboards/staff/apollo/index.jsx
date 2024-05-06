import { gql } from "@apollo/client";

export const GET_STAFFS = gql`
  query Data(
    $where: StaffWhereInput
    $orderBy: OrderByInput
    $skip: Int
    $limit: Int
    $noLimit: Boolean
  ) {
    queryStaffs(
      where: $where
      orderBy: $orderBy
      skip: $skip
      limit: $limit
      noLimit: $noLimit
    ) {
      total
      data {
        _id
        addProfile
        firstname
        lastname
        username
        newName
        gender
        email
        phone
        birthday
        position
        address
        country
        district
        village
        role {
          _id
          name
          status
          createdAt
          updatedAt
        }
        status
        createdAt
        updatedAt
      }
    }
  }
`;

export const GET_ROLES = gql`
  query Data(
    $where: Role_staffWhereInput
    $orderBy: OrderByFolderAndFileInput
    $skip: Int
    $limit: Int
    $noLimit: Boolean
  ) {
    role_staffs(
      where: $where
      orderBy: $orderBy
      skip: $skip
      limit: $limit
      noLimit: $noLimit
    ) {
      data {
        _id
        name
        status
        permision {
          _id
          name
        }
        createdAt
        updatedAt
      }
    }
  }
`;

export const GET_COUNTRIES = gql`
  query Data {
    getCountries {
      data {
        _id
        name
        code
        iso
        avatar
        createdAt
        updatedAt
        createdBy {
          _id
        }
      }
      total
    }
  }
`;

export const MUTATION_CREATE_STAFF = gql`
  mutation CreateStaff($data: StaffInput!) {
    createStaff(data: $data) {
      _id
      newName
    }
  }
`;

export const MUTATION_DELETE_STAFF = gql`
  mutation DeleteStaff($where: WhereById!) {
    deleteStaff(where: $where) {
      _id
      newName
    }
  }
`;
export const MUTATION_UPDATE_STAFF = gql`
  mutation UpdateStaff($data: StaffInput!, $where: StaffWhereInput!) {
    updateStaff(data: $data, where: $where) {
      _id
      newName
    }
  }
`;
