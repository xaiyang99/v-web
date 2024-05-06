import { gql } from "@apollo/client";

export const QUERY_SHARE_ALL = gql`
  query Data($where: ShareWhereInput) {
    getShare(where: $where) {
      data {
        _id
        folderId {
          _id
          url
          folder_type
          folder_name
          newFolder_name
          checkFolder
          restore
          access_password
          show_download_link
          status
          path
        }
        permission
        fromAccount {
          _id
          username
          email
        }
        toAccount {
          _id
          username
          email
        }
        fileId {
          _id
          filename
          newFilename
          fileType
          url
        }
        accessKey
        isPublic
        status
        createdAt
        accessedAt
        expiredAt
        createdBy {
          _id
        }
        isShare
      }
    }
  }
`;

export const UPDATE_STATUS_SHARE = gql`
  mutation UpdateShare($id: ID!, $body: ShareInput) {
    updateShare(ID: $id, body: $body)
  }
`;

export const DELETE_SHARE = gql`
  mutation DeleteShare($id: ID!) {
    deleteShare(ID: $id)
  }
`;
