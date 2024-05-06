import { gql } from "@apollo/client";

export const QUERY_FOLDERS = gql`
  query Folders($where: FoldersWhereInput, $orderBy: OrderByInput) {
    folders(where: $where, orderBy: $orderBy) {
      data {
        _id
        folder_type
        folder_name
        newFolder_name
        total_size
        is_public
        checkFolder
        restore
        access_password
        show_download_link
        status
        path
        newPath
        url
        expired
        permissionSharePublic
        aproveDownloadPublic
        pin
        totalItems
        getLinkBy
        createdBy {
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
          ip
          device
          browser
          status
          profile
          country
          currentDevice
          newDevice
          twoFactorSecret
          twoFactorQrCode
          twoFactorIsEnabled
          twoFactorIsVerified
          createdAt
          updatedAt
          lastLoggedInAt
          codeAnonymous
          anonymousExpired
          storage
        }
        createdAt
        updatedAt
      }
    }
  }
`;

export const QUERY_SHARES = gql`
  query GetShare(
    $where: ShareWhereInput
    $orderBy: OrderByInput
    $skip: Int
    $limit: Int
    $noLimit: Boolean
  ) {
    getShare(
      where: $where
      orderBy: $orderBy
      skip: $skip
      limit: $limit
      noLimit: $noLimit
    ) {
      data {
        _id
        ownerId {
          _id
        }
        folderId {
          _id
        }
        fromAccount {
          _id
        }
        toAccount {
          _id
        }
        isPublic
        isShare
        status
        permission
        accessKey
        accessedAt
        createdAt
        createdBy {
          _id
        }
        fileId {
          _id
        }
        expiredAt
      }
      total
    }
  }
`;
