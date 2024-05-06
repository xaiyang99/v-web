import { gql } from "@apollo/client";
export const DELETE_CHECK_DOWNLOAD = gql`
  mutation Mutation($where: CheckdownloadWhereOneInput!) {
    deleteCheckdownload(where: $where) {
      _id
    }
  }
`;
export const QUERY_CHECK_DOWNLOAD = gql`
  query Checkdownloads(
    $limit: Int
    $skip: Int
    $orderBy: OrderByInput
    $where: CheckdownloadWhereInput
  ) {
    checkdownloads(limit: $limit, skip: $skip, orderBy: $orderBy, where: $where) {
      total
      data {
        _id
        ip
        totalDownload
        createdAt
        updatedAt
        fileID {
          _id
          filename
          newFilename
          size
        }
        downloadBy {
          _id
          firstName
          lastName
        }
      }
    }
  }
`;
export const GET_FILES = gql`
  query Data(
    $limit: Int
    $orderBy: OrderByInput
    $noLimit: Boolean
    $skip: Int
    $where: FilesWhereInput
    $request: Request
  ) {
    files(
      limit: $limit
      orderBy: $orderBy
      noLimit: $noLimit
      skip: $skip
      where: $where
      request: $request
    ) {
      total
      data {
        _id
        filename
        newFilename
        size
        totalDownload
        status
        checkFile
        path
        newPath
        url
        detail
        createdBy {
          _id
          gender
          firstName
          lastName
          email
          newName
          username
        }
        downloadBy {
          _id
        }
        createdAt
      }
    }
  }
`;

export const GET_USERS = gql`
  query Data(
    $where: UserWhereInput
    $orderBy: OrderByInput
    $skip: Int
    $limit: Int
    $noLimit: Boolean
  ) {
    getUser(where: $where, orderBy: $orderBy, skip: $skip, limit: $limit, noLimit: $noLimit) {
      data {
        _id
        accountId
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
        createdAt
        updatedAt
      }
    }
  }
`;

export const UPDATE_FILES = gql`
  mutation UpdateFiles($data: FilesInput!, $where: FilesWhereInputOne!) {
    updateFiles(data: $data, where: $where) {
      _id
      status
      filename
    }
  }
`;

export const DELETE_FILE = gql`
  mutation DeleteFiles($id: [ID!]) {
    deleteFiles(ID: $id)
  }
`;

export const QUERY_FILE_ACTIVE = gql`
  query Data($limit: Int, $orderBy: OrderByInput, $where: FilesWhereInput) {
    files(limit: $limit, orderBy: $orderBy, where: $where) {
      total
      data {
        _id
        filename
        newFilename
        size
        totalDownload
        status
        checkFile
        path
        url
        detail
        createdBy {
          _id
          gender
          firstName
          lastName
          email
          username
        }
        downloadBy {
          _id
        }
        createdAt
      }
    }
  }
`;
