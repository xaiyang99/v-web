import { gql } from "@apollo/client";

export const QUERY_SEARCH = gql`
  query SearchFolderAndFile($where: SearchFolderAndFilesInput) {
    searchFolderAndFile(where: $where) {
      data {
        _id
        url
        name
        newName
        size
        updatedAt
        createdAt
        type
        parentKey
        type_idFile
        checkTypeItem
        check
        newPath
        pin
        favorite
        totalDownloadFile
        createdBy {
          _id
          newName
        }
      }
    }
  }
`;
