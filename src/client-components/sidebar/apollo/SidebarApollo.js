import { gql } from "@apollo/client";

export const CREATE_FOLDER = gql`
  mutation CreateFolders($data: FoldersInput!) {
    createFolders(data: $data) {
      _id
    }
  }
`;

export const UPLOAD_FILE = gql`
  mutation CreateFiles($data: FilesInput!) {
    createFiles(data: $data) {
      _id
      path
    }
  }
`;

export const RE_UPLOAD_FILE = gql`
  mutation CreateFiles($data: FilesInput!) {
    createFiles(data: $data) {
      _id
      path
    }
  }
`;

export const UPLOAD_FOLDER = gql`
  mutation UploadFolder($data: UploadFolderInput!) {
    uploadFolder(data: $data) {
      path
      status
    }
  }
`;
export const QUERY_RENDER_FOLDER = gql`
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
        url
        path
        pin
        createdBy {
          _id
          email
          username
        }
        file_id {
          _id
          filename
          size
        }
        updatedAt
      }
    }
  }
`;
