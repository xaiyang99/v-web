import { gql } from "@apollo/client";

export const QUERY_FILES = gql`
  query Files(
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
        filename
        newFilename
        filePassword
        passwordUrlAll
        fileType
        size
        totalDownload
        status
        isPublic
        checkFile
        path
        newPath
        detail
        urlAll
        url
        permissionSharePublic
        aproveDownloadPublic
        ip
        folder_id {
          _id
          path
          folder_name
        }
        createdBy {
          _id
          newName
        }
        favorite
        actionStatus
        expired
        createdAt
        updatedAt
        actionDate
      }
      total
    }
  }
`;

export const QUERY_FOLDERS = gql`
  query Folders(
    $where: FoldersWhereInput
    $orderBy: OrderByInput
    $skip: Int
    $limit: Int
    $noLimit: Boolean
  ) {
    folders(
      where: $where
      orderBy: $orderBy
      skip: $skip
      limit: $limit
      noLimit: $noLimit
    ) {
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
        url
        expired
        file_id {
          _id
          filename
          size
        }
        permissionSharePublic
        aproveDownloadPublic
        pin
        createdAt
        updatedAt
      }
      total
    }
  }
`;

export const MUTATION_FILES = gql`
  mutation UpdateFiles($data: FilesInput!, $where: FilesWhereInputOne!) {
    updateFiles(data: $data, where: $where) {
      _id
      filename
      newFilename
      filePassword
      passwordUrlAll
      fileType
      size
      totalDownload
      status
      isPublic
      checkFile
      path
      detail
      urlAll
      url
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
`;

export const MUTATION_FOLDERS = gql`
  mutation UpdateFolders($data: FoldersInput!, $where: FoldersWhereInputOne!) {
    updateFolders(data: $data, where: $where) {
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
      url
      expired
      permissionSharePublic
      aproveDownloadPublic
      pin
      createdAt
      updatedAt
    }
  }
`;

export const MUTATION_ACTION_FILES = gql`
  mutation ActionFiles($fileInput: actionFileInput) {
    actionFiles(fileInput: $fileInput)
  }
`;
