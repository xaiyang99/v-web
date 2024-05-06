import { gql } from "@apollo/client";

export const CREATE_FILEDROP_LINK_CLIENT = gql`
  mutation CreatePrivateFileDropUrl($input: PrivateFileDropUrlInput) {
    createPrivateFileDropUrl(input: $input) {
      _id
    }
  }
`;

// export const QUERY_FILEDROP_LINKS = gql`
//   query GetPrivateFileDropUrl($where: PrivateFileDropUrlWhereInput) {
//     getPrivateFileDropUrl(where: $where) {
//       total
//       data {
//         _id
//         url
//         createdAt
//         expiredAt
//         status
//         folderId {
//           _id
//           folder_name
//         }
//       }
//     }
//   }
// `;

export const QUERY_FILEDROP_LINKS = gql`
  query Data($where: PrivateFileDropUrlWhereInput) {
    getPrivateFileDropUrl(where: $where) {
      data {
        _id
        url
        createdAt
        expiredAt
        status
        folderId {
          _id
          folder_name
        }
      }
    }
  }
`;

export const DELETE_FILEDROP_LINK = gql`
  mutation DeleteFileDropUrl($id: ID!) {
    deleteFileDropUrl(ID: $id)
  }
`;

export const QUERY_ALL_FILES_DROP = gql`
  query Files($where: FilesWhereInput) {
    files(where: $where) {
      total
      data {
        _id
        filename
        newFilename
        filePassword
        passwordUrlAll
        fileType
        size
        totalDownload
        totalDownloadFaild
        status
        isPublic
        checkFile
        path
        newPath
        detail
        url
        urlAll
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
  }
`;
