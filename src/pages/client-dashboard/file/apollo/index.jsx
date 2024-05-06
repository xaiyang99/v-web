import { gql } from "@apollo/client";

export const QUERY_ALL_FILES = gql`
  query GetCountDetail($fileInput: selectFileInput, $skip: Int, $limit: Int) {
    getCountDetail(fileInput: $fileInput, skip: $skip, limit: $limit) {
      total
      response {
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
        createdBy {
          _id
          email
          newName
        }
      }
    }
  }
`;

export const QUERY_ALL_FILE_CATEGORIES = gql`
  query GetFileCategoryDetails(
    $where: FileCategoryDetailInput
    $limit: Int
    $skip: Int
  ) {
    getFileCategoryDetails(where: $where, limit: $limit, skip: $skip) {
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
        createdBy {
          _id
          email
          newName
        }
      }
    }
  }
`;

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

export const MUTATION_DELETE_FILES = gql`
  mutation DeleteFilesTrash($id: [ID!]) {
    deleteFilesTrash(ID: $id)
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

export const UPLOAD_FILE = gql`
  mutation CreateFiles($data: FilesInput!) {
    createFiles(data: $data) {
      _id
      path
    }
  }
`;

export const DOWNLOAD_TO_CLOUD = gql`
  mutation CopyFiles($pathFile: PathFile!) {
    copyFiles(PathFile: $pathFile) {
      status
    }
  }
`;
