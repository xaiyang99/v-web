import { gql } from "@apollo/client";

export const CREATE_SHARE = gql`
  mutation CreateShare($body: ShareInput) {
    createShare(body: $body) {
      _id
    }
  }
`;

export const CREATE_SHARE_FROM_SHARING = gql`
  mutation HandleOnlyShare($body: OnlyShareInput) {
    handleOnlyShare(body: $body) {
      _id
    }
  }
`;

export const QUERY_SHARE_ME = gql`
  query GetShare(
    $where: ShareWhereInput
    $orderBy: OrderByInput
    $skip: Int
    $limit: Int
  ) {
    getShare(where: $where, orderBy: $orderBy, skip: $skip, limit: $limit) {
      data {
        _id
        isShare
        ownerId {
          _id
          email
          newName
        }
        fileId {
          _id
          filename
          isPublic
          favorite
          size
          url
          fileType
          totalDownload
          newFilename
          path
          newPath
          updatedAt
          createdAt
        }
        folderId {
          folder_name
          _id
          folder_type
          file_id {
            _id
            filename
            size
          }
          newFolder_name
          total_size
          is_public
          checkFolder
          status
          path
          newPath
          url
          pin
          updatedAt
        }
        createdAt
        fromAccount {
          _id
          username
          email
          newName
        }
        toAccount {
          _id
          email
          username
        }
        accessKey
        isPublic
        status
        permission
        accessedAt
        expiredAt
      }
      total
    }
  }
`;

export const QUERY_CHECK_FOLDER = gql`
  query Data($where: FoldersWhereInput) {
    folders(where: $where) {
      data {
        checkFolder
      }
    }
  }
`;

export const DELETE_SHARE_STATUS = gql`
  mutation UpdateShare($id: ID!, $body: ShareInput) {
    updateShare(ID: $id, body: $body)
  }
`;

export const DELETE_SHARE = gql`
  mutation DeleteShare($id: ID!) {
    deleteShare(ID: $id)
  }

`;
export const QUERY_SHARE_ME_RENDER = gql`
  query Data {
    getShare {
      data {
        _id
      }
    }
  }
`;

export const UPDATE_TOTAL_DOWNLOAD = gql`
  mutation UpdateFiles($where: FilesWhereInputOne!, $data: FilesInput!) {
    updateFiles(where: $where, data: $data) {
      _id
    }
  }
`;
