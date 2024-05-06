import { gql } from "@apollo/client";

export const CREATE_FILEDROP_LINK = gql`
  mutation CreatePublicFileDropUrl($input: PublicFileDropUrlInput) {
    createPublicFileDropUrl(input: $input) {
      _id
    }
  }
`;

export const UPDATE_FILE_DROP_STATUS = gql`
  mutation UpdateFilesPublic($data: FilesInput!, $where: FilesWhereInputOne!) {
    updateFilesPublic(data: $data, where: $where) {
      _id
    }
  }
`;

export const QUERY_FILE_DROP_PUBLIC = gql`
  query GetFileDrop($where: FilesWhereInput) {
    getFileDrop(where: $where) {
      total
      data {
        _id
        filename
        newFilename
        size
        status
        checkFile
        newPath
        url
        urlAll
        ip
        dropUrl
        dropStatus
        updatedAt
      }
    }
  }
`;

export const QUERY_USER_BY_FILE_DROP_URL = gql`
  query GetPublicFileDropUrl($where: PublicFileDropUrlWhereInput) {
    getPublicFileDropUrl(where: $where) {
      total
      data {
        _id
        status
        createdBy {
          _id
          newName
        }
        folderId {
          _id
          newFolder_name
          path
          newPath
        }
      }
    }
  }
`;
export const QUERY_GENERAL_BUTTON_DOWNLOADS = gql`
  query Data($where: General_settingsWhereInput) {
    general_settings(where: $where) {
      data {
        action
      }
    }
  }
`;
export const QUERY_ADVERTISEMENTS = gql`
  query Data($where: AdvertisementWhereInput) {
    getAdvertisement(where: $where) {
      data {
        _id
        url
      }
    }
  }
`;
export const CREATED_DETAIL_ADVERTISEMENTS = gql`
  mutation CreateDetailadvertisements($data: DetailadvertisementsInput!) {
    createDetailadvertisements(data: $data) {
      _id
    }
  }
`;
