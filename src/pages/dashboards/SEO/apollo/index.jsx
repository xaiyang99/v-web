import { gql } from "@apollo/client";

export const QUERY_SEO = gql`
  query GetSEO($where: SEOWhereInput) {
    getSEO(where: $where) {
      data {
        _id
        title
        description
        keywords
        status
        pageId {
          _id
          name
        }
      }
    }
  }
`;

export const CREATE_SEO = gql`
  mutation CreateSEO($input: SEOInput!) {
    createSEO(input: $input) {
      _id
    }
  }
`;

export const UPDATE_SEO = gql`
  mutation UpdateSEO($id: ID!, $input: SEOInput!) {
    updateSEO(ID: $id, input: $input)
  }
`;

// =============== page =============
export const MUTATION_CREATE_PAGE = gql`
  mutation CreatePage($input: CreatePageInput!) {
    createPage(input: $input) {
      _id
    }
  }
`;

export const QUERY_PAGE = gql`
  query Data($where: PageWhereInput) {
    getPages(where: $where) {
      total
      data {
        _id
        name
      }
    }
  }
`;

export const MUTATION_DELETE_PAGE = gql`
  mutation DeletePage($id: [ID!]) {
    deletePage(ID: $id)
  }
`;

export const MUTATION_UPDATE_PAGE = gql`
  mutation UpdatePage($id: ID!, $input: UpdatePageInput!) {
    updatePage(ID: $id, input: $input)
  }
`;
