import { gql } from "@apollo/client";

export const QUERY_SUB_FOLDERS_AND_FILES = gql`
  query QuerySubFolderAndFile(
    $where: FolderAndFilesInput
    $orderBy: OrderByFolderAndFileInput
    $limit: Int
    $skip: Int
  ) {
    querySubFolderAndFile(
      where: $where
      orderBy: $orderBy
      limit: $limit
      skip: $skip
    ) {
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
        newPath
        pin
        createdAt
        createdBy {
          _id
          newName
        }
        expiredFile
        access_passwordFolder
        downloadByFile
        updatedAt
        updatedBy {
          _id
        }
        uploadByFile
        password
      }
      total
    }
  }
`;

export const QUERY_NEST_FOLDERS = gql`
  query Folders($where: FoldersWhereInput, $orderBy: OrderByInput) {
    queryFolders(where: $where, orderBy: $orderBy) {
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
        newPath
        pin
        parentkey
        show_download_link
        status
        updatedAt
        updatedBy {
          _id
        }
        createdBy {
          _id
          newName
        }
      }
    }
  }
`;

export const QUERY_FOLDERS = gql`
  query Folders($where: FoldersWhereInput, $orderBy: OrderByInput) {
    folders(where: $where, orderBy: $orderBy) {
      data {
        _id
        checkFolder
        createdAt
        file_id {
          _id
          status
          size
        }
        folder_name
        folder_type
        newFolder_name
        url
        path
        newPath
        pin
        parentkey {
          _id
        }
        show_download_link
        total_size
        status
        updatedAt
        updatedBy {
          _id
        }
        createdBy {
          _id
          newName
        }
      }
      total
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
        favorite
        actionStatus
        expired
        createdAt
        updatedAt
        actionDate
        createdBy {
          _id
          newName
        }
      }
      total
    }
  }
`;

export const QUERY_SHARES = gql`
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

export const MUTATION_FILES = gql`
  mutation UpdateFiles($data: FilesInput!, $where: FilesWhereInputOne!) {
    updateFiles(data: $data, where: $where) {
      _id
    }
  }
`;

export const MUTATION_FOLDERS = gql`
  mutation UpdateFolders($data: FoldersInput!, $where: FoldersWhereInputOne!) {
    updateFolders(data: $data, where: $where) {
      _id
    }
  }
`;

export const MUTATION_ACTION_FILES = gql`
  mutation ActionFiles($fileInput: actionFileInput) {
    actionFiles(fileInput: $fileInput)
  }
`;

export const MUTATION_DELETE_SHARE = gql`
  mutation DeleteShare($id: ID!) {
    deleteShare(ID: $id)
  }
`;
