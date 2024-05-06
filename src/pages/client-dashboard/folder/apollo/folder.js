import { gql } from "@apollo/client";

export const QUERY_FOLDER = gql`
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
        parentkey {
          _id
        }
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
    }
  }
`;
export const UPADATE_FOLDERS = gql`
  mutation UpdateFolders($data: FoldersInput!, $where: FoldersWhereInputOne!) {
    updateFolders(data: $data, where: $where) {
      _id
    }
  }
`;

export const DELETE_FOLDER = gql`
  mutation UpdateFolders($data: FoldersInput!, $where: FoldersWhereInputOne!) {
    updateFolders(data: $data, where: $where) {
      _id
    }
  }
`;

// sub folder query
export const QUERY_SUBFOLDER = gql`
  query Folders($where: FoldersWhereInput, $orderBy: OrderByInput) {
    folders(where: $where, orderBy: $orderBy) {
      data {
        _id
        folder_name
        parentkey {
          _id
          folder_name
          folder_type
          updatedAt
          createdBy {
            _id
            username
            typeUser
            imageUser
          }
        }
        file_id {
          _id
          filename
          fileType
          newFilename
          createdAt
          createdBy {
            _id
          }
          updatedAt
          detail
          size
          status
          isPublic
        }
      }
    }
  }
`;

export const QUERY_SUBFOLDER_FILE = gql`
  query Data($where: FolderAndFilesInput, $orderBy: OrderByFolderAndFileInput) {
    querySubFolderAndFile(where: $where, orderBy: $orderBy) {
      data {
        _id
        check
        url
        checkTypeItem
        isPublicFile
        is_publicFolder
        name
        newName
        parentKey
        show_download_linkFolder
        size
        status
        totalDownloadFile
        type
        type_idFile
        detailFile
        path
        createdAt
        createdBy {
          _id
        }
        expiredFile
        access_passwordFolder
        downloadByFile
        updatedAt
        updatedBy {
          _id
        }
        uploadByFile
      }
    }
  }
`;
