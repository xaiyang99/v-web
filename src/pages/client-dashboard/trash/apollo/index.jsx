import { gql } from "@apollo/client";

export const QUERY_FILES_AND_FOLDER = gql`
  query Folders(
    $where: FoldersWhereInput
    $orderBy: OrderByInput
    $limit: Int
  ) {
    folders(where: $where, orderBy: $orderBy, limit: $limit) {
      total
      data {
        _id
        folder_name
        checkFolder
        createdBy {
          _id
        }
      }
    }
  }
`;

export const QUERY_FOLDER_FILE_DELETED = gql`
  query QueryDeleteSubFolderAndFile($orderBy: OrderByFolderAndFileInput, $where: FolderAndFilesInput) {
    queryDeleteSubFolderAndFile(orderBy: $orderBy, where: $where) {
      total
      data {
        _id
        check
        checkTypeItem
        detailFile
        parentKey
        status
        totalItems
        type
        type_idFile
        isPublicFile
        name
        newName
        path
        newPath
        is_publicFolder
        access_passwordFolder
        expiredFile
        downloadByFile
        show_download_linkFolder
        size
        totalDownloadFile
        createdAt
        createdBy {
          _id
        }
        updatedAt
        updatedBy {
          _id
        }
        uploadByFile
      }
    }
  }
`;

export const RESTORE_FILE = gql`
  mutation UpdateFiles($data: FilesInput!, $where: FilesWhereInputOne!) {
    updateFiles(data: $data, where: $where) {
      _id
    }
  }
`;

export const RESTORE_FOLDER = gql`
  mutation UpdateFolders($where: FoldersWhereInputOne!, $data: FoldersInput!) {
    updateFolders(where: $where, data: $data) {
      _id
    }
  }
`;

export const DELETE_FILE = gql`
  mutation DeleteFilesTrash($id: [ID!]) {
    deleteFilesTrash(ID: $id)
  }
`;

export const DELETE_FOLDER = gql`
  mutation DeleteFolders($where: FoldersWhereInputOne!) {
    deleteFolders(where: $where) {
      _id
    }
  }
`;
export const TRASH_FOLDER = gql`
  mutation DeleteFoldersTrash($where: FoldersWhereInputOne!) {
    deleteFoldersTrash(where: $where) {
      _id
    }
  }
`;
