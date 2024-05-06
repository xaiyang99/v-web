import { gql } from "@apollo/client";

export const QUERY_SEO = gql`
  query Data($where: SEOWhereInput) {
    getPublicSEO(where: $where) {
      data {
        _id
        title
        description
        keywords
        pageId {
          _id
        }
      }
    }
  }
`;
