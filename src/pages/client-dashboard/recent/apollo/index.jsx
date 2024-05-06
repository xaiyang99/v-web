import { gql } from "@apollo/client";

export const QUERY_DESC_RECENT_FILE = gql`
  query GetRecentFile(
    $orderBy: OrderByInput
    $where: FilesWhereInput
    $limit: Int
  ) {
    getRecentFile(orderBy: $orderBy, where: $where, limit: $limit) {
      data {
        _id
        filename
        totalDownload
        newFilename
        fileType
        detail
        size
        url
        actionStatus
        filePassword
        actionDate
        favorite
        expired
        path
        createdAt
        actionStatus
        actionDate
        updatedAt
        path
        newPath
        createdBy {
          _id
          email
          username
          newName
        }
        folder_id {
          _id
          path
          folder_type
          folder_name
        }
      }
      total
    }
  }
`;
export const QUERY_RECENT_FILE_ALL = gql`
  query GetRecentFile(
    $limit: Int
    $orderBy: OrderByInput
    $where: FilesWhereInput
  ) {
    getRecentFile(limit: $limit, orderBy: $orderBy, where: $where) {
      data {
        _id
        filename
        newFilename
        fileType
        detail
        size
        actionStatus
        actionDate
        favorite
        expired
        path
        createdAt
        updatedAt
        createdBy {
          _id
          email
          username
        }
        folder_id {
          _id
          folder_type
          folder_name
        }
      }
    }
  }
`;
export const MUTATION_DELETE_RECENT_FILE = gql`
  mutation UpdateFiles($data: FilesInput!, $where: FilesWhereInputOne!) {
    updateFiles(data: $data, where: $where) {
      _id
    }
  }
`;

export const MUTATION_UPDATE_RECENT_FILE = gql`
  mutation UpdateFiles($data: FilesInput!, $where: FilesWhereInputOne!) {
    updateFiles(data: $data, where: $where) {
      _id
      filename
      newFilename
      filePassword
      passwordUrlAll
      fileType
      size
      totalDownload
      status
      isPublic
      checkFile
      path
      detail
      urlAll
      url
      permissionSharePublic
      aproveDownloadPublic
      ip
      favorite
      actionStatus
      expired
      createdAt
      updatedAt
      actionDate
    }
  }
`;

export const MUTATION_ACTION_FILE = gql`
  mutation ActionFiles($fileInput: actionFileInput) {
    actionFiles(fileInput: $fileInput)
  }
`;

export const QUERY_FOLDERS = gql`
  query Folders($where: FoldersWhereInput, $orderBy: OrderByInput) {
    folders(where: $where, orderBy: $orderBy) {
      data {
        _id
        checkFolder
        createdAt
        file_id {
          _id
        }
        folder_name
        folder_type
        url
        path
        pin
        show_download_link
        status
        updatedAt
        updatedBy {
          _id
        }
        createdBy {
          _id
        }
      }
      total
    }
  }
`;
