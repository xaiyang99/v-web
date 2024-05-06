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

export const DELETE_FILE = gql`
  mutation DeleteFiles($id: [ID!]) {
    deleteFiles(ID: $id)
  }
`;

export const UPLOAD_FOLDER = gql`
  mutation UploadFolder($data: UploadFolderInput!) {
    uploadFolder(data: $data) {
      _id
      status
      path {
        newPath
        path
      }
    }
  }
`;

export const DELETE_FOLDER = gql`
  mutation DeleteFolders($where: FoldersWhereInputOne!) {
    deleteFolders(where: $where) {
      _id
    }
  }
`;

export const CANCEL_UPLOAD_FOLDER = gql`
  mutation DeleteFoldersOutStatus($where: FoldersWhereInputOne!) {
    deleteFoldersOutStatus(where: $where) {
      _id
    }
  }
`;

export const NEW_PATH_FOLDER = gql`
  query Folders($where: FoldersWhereInput) {
    folders(where: $where) {
      data {
        _id
        path
        newFolder_name
        newPath
      }
    }
  }
`;
