import { gql } from "@apollo/client";

export const MUTATION_SOFT_DELETE_FOLDER = gql`
  mutation UpdateFolders($data: FoldersInput!, $where: FoldersWhereInputOne!) {
    updateFolders(data: $data, where: $where) {
      _id
    }
  }
`;

export const MUTATION_UPDATE_FOLDER = gql`
  mutation UpdateFolders($data: FoldersInput!, $where: FoldersWhereInputOne!) {
    updateFolders(data: $data, where: $where) {
      _id
      pin
    }
  }
`;

export const QUERY_FOLDER = gql`
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
        parentkey
        pin
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
      total
    }
  }
`;
