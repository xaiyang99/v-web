import { gql } from "@apollo/client";

export const QUERY_DESC_FOLDER = gql`
  query Data(
    $where: FoldersWhereInput
    $orderBy: OrderByInput
    $limit: Int
    $skip: Int
  ) {
    folders(where: $where, orderBy: $orderBy, limit: $limit, skip: $skip) {
      total
      data {
        _id
        folder_name
        total_size
        folder_type
        checkFolder
        newFolder_name
        access_password
        url
        path
        newPath
        pin
        createdBy {
          _id
          email
          username
          newName
        }
        file_id {
          _id
          filename
          size
          status
        }
        parentkey {
          _id
        }
        updatedAt
      }
    }
  }
`;

export const QUERY_DESC_MAIN_FILES = gql`
  query Files(
    $where: FilesWhereInput
    $limit: Int
    $orderBy: OrderByInput
    $skip: Int
  ) {
    files(where: $where, limit: $limit, orderBy: $orderBy, skip: $skip) {
      total
      data {
        _id
        favorite
        url
        filename
        fileType
        path
        newPath
        size
        detail
        totalDownload
        newFilename
        filePassword
        createdAt
        updatedAt
        createdBy {
          _id
          firstName
          lastName
          username
          gender
          newName
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
    }
  }
`;

export const QUERY_FILE_BASEDON_FILETYPE = gql`
  query GetCountAll($fileInput: paramsFileInput, $skip: Int, $limit: Int) {
    getCountAll(fileInput: $fileInput, skip: $skip, limit: $limit) {
      total
      response {
        fileType
        totalFile
        storageUsed
      }
    }
  }
`;

export const QUERY_FILE_CATEGORY = gql`
  query GetFileCategories {
    getFileCategories {
      total
      data {
        fileType
        total
        size
      }
    }
  }
`;

export const MUTATION_ACTION_FILE = gql`
  mutation ActionFiles($fileInput: actionFileInput) {
    actionFiles(fileInput: $fileInput)
  }
`;
