import { gql } from "@apollo/client";

export const QUERY_ROLES = gql`
  query Data {
    getRole {
      data {
        _id
        name
        totalStorage
        uploadPerDay
        concurrentUpload
        maxUploadSize
        downloadPerDay
        concurrentDownload
        maxDownloadSize
        access
        dashboardView
        fileView
        fileCreate
        fileEdit
        fileDelete
        fileUpload
        fileDownload
        fileShare
        fileExport
        shareView
        shareCreate
        shareEdit
        shareDelete
        userView
        userCreate
        userEdit
        userDelete
        roleView
        roleCreate
        roleEdit
        roleDelete
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
          groupName
        }
        createdAt
        updatedAt
      }
      total
    }
  }
`;

export const GET_PERMISSION_STAFFS = gql`
  query Permissions_staffs(
    $where: Permissions_staffWhereInput
    $orderBy: OrderByFolderAndFileInput
    $skip: Int
    $limit: Int
    $noLimit: Boolean
  ) {
    permissions_staffs(
      where: $where
      orderBy: $orderBy
      skip: $skip
      limit: $limit
      noLimit: $noLimit
    ) {
      total
      data {
        _id
        name
        groupName
        status
        createdAt
        updatedAt
      }
    }
  }
`;

export const GET_PERMISSION_DETAIL_STAFFS = gql`
  query Data(
    $where: Detail_staff_permisionWhereInput
    $orderBy: OrderByFolderAndFileInput
    $skip: Int
    $limit: Int
    $noLimit: Boolean
  ) {
    detail_staff_permisions(
      where: $where
      orderBy: $orderBy
      skip: $skip
      limit: $limit
      noLimit: $noLimit
    ) {
      data {
        _id
        roleID {
          name
        }
        createdAt
        updatedAt
      }
      total
    }
  }
`;

export const MUTATION_CREATE_ROLE_STAFF = gql`
  mutation CreateRole_staff($data: Role_staffInput!) {
    createRole_staff(data: $data) {
      _id
      name
      status
      createdAt
      updatedAt
    }
  }
`;

export const MUTATION_UPDATE_ROLE_STAFF = gql`
  mutation UpdateRole_staff(
    $data: Role_staffInput!
    $where: Role_staffWhereOneInput!
  ) {
    updateRole_staff(data: $data, where: $where) {
      _id
      name
      status
      createdAt
      updatedAt
    }
  }
`;

export const MUTATION_CREATE_PERMISSION_STAFF = gql`
  mutation CreatePermissions_staff($data: Permissions_staffInput!) {
    createPermissions_staff(data: $data) {
      _id
      name
      status
      createdAt
      updatedAt
    }
  }
`;

export const MUTATION_CREATE_PERMISSION_DETAIL_STAFF = gql`
  mutation CreateDetail_staff_permision($data: Detail_staff_permisionInput!) {
    createDetail_staff_permision(data: $data) {
      _id
      createdAt
      updatedAt
    }
  }
`;

export const MUTATION_UPDATE_PERMISSION_STAFF = gql`
  mutation UpdateDetail_staff_permision(
    $data: Detail_staff_permisionInput!
    $where: Detail_staff_permisionWhereOneInput!
  ) {
    updateDetail_staff_permision(data: $data, where: $where) {
      _id
      createdAt
      updatedAt
    }
  }
`;

export const MUTATION_DELETE_PERMISSION_DETAIL_STAFF = gql`
  mutation DeleteDetail_staff_permision(
    $where: Detail_staff_permisionWhereOneInput!
  ) {
    deleteDetail_staff_permision(where: $where) {
      _id
      createdAt
      updatedAt
    }
  }
`;

export const MUTATION_DELETE_ROLE_STAFF = gql`
  mutation DeleteRole_staff($where: Role_staffWhereOneInput!) {
    deleteRole_staff(where: $where) {
      _id
      name
      status
      updatedAt
    }
  }
`;

export const MUTATION_CREATE_ROLE = gql`
  mutation CreateRole($body: RoleInput!) {
    createRole(body: $body) {
      _id
    }
  }
`;

export const MUTATION_DELETE_ROLE = gql`
  mutation DeleteRole($id: [ID!]!) {
    deleteRole(ID: $id)
  }
`;

export const MUTATION_UPDATE_ROLE = gql`
  mutation UpdateRole($body: RoleInput!, $id: ID) {
    updateRole(body: $body, ID: $id)
  }
`;
