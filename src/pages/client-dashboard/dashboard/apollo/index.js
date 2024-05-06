import gql from "graphql-tag";

export const TOTAL_ACTIVE_FILES = gql`
  query Files($where: FilesWhereInput) {
    files(where: $where) {
      total
      data {
        totalDownload
        size
      }
    }
  }
`;

export const TOTAL_STORAGE = gql`
  query Data($where: LevelWhereInput) {
    getLevel(where: $where) {
      data {
        _id
        name
        totalStorage
      }
    }
  }
`;

export const QUERY_GET_FILE = gql`
  query GetFile(
    $where: FilesWhereInput
    $orderBy: OrderByInput
    $skip: Int
    $limit: Int
    $noLimit: Boolean
  ) {
    files(
      where: $where
      orderBy: $orderBy
      skip: $skip
      limit: $limit
      noLimit: $noLimit
    ) {
      data {
        _id
        actionDate
        actionStatus
        aproveDownloadPublic
        checkFile
        createdAt
        detail
        expired
        favorite
        filePassword
        fileType
        filename
        folder_id {
          _id
        }
        ip
        isPublic
        newFilename
        passwordUrlAll
        path
        permissionSharePublic
        size
        status
        totalDownload
        totalDownloadFaild
        updatedAt
        type_id {
          _id
        }
        url
        urlAll
      }
      total
    }
  }
`;

export const QUERY_GET_SPACE = gql`
  query GetSpaces {
    getSpaces {
      name
      usedStorage
      totalStorage
    }
  }
`;

export const QUERY_GET_ROLE = gql`
  query GetRole(
    $where: RoleWhereInput
    $orderBy: OrderByInput
    $skip: Int
    $limit: Int
    $noLimit: Boolean
  ) {
    getRole(
      where: $where
      orderBy: $orderBy
      skip: $skip
      limit: $limit
      noLimit: $noLimit
    ) {
      data {
        _id
        createdAt
        levelId {
          _id
          name
          totalStorage
          uploadPerDay
          concurrentUpload
          maxUploadSize
          downloadPerDay
          concurrentDownload
          maxDownloadSize
          createdAt
          updatedAt
        }
        name
        updatedAt
      }
      total
    }
  }
`;

export const QUERY_ANNOUNCEMENTS = gql`
  query Data(
    $where: AnnouncementWhereInput
    $orderBy: OrderByInput
    $skip: Int
    $limit: Int
  ) {
    getAnnouncements(
      where: $where
      orderBy: $orderBy
      skip: $skip
      limit: $limit
    ) {
      total
      data {
        _id
        createdAt
        createdBy {
          _id
          email
        }
        image
        status
        title
        updatedAt
        notificationTo
        startDate
        content
        endDate
        notificationStatus
      }
    }
  }
`;
