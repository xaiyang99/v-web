import { gql } from "@apollo/client";

// query all main features
export const QUERY_ALL_MAIN_FEATURES = gql`
  query Query($where: FeaturesWhereInput, $limit: Int) {
    features(where: $where, limit: $limit) {
      total
      data {
        Content1
        image
        title
      }
    }
  }
`;

export const QUERY_ALL_SUB_FEATURES = gql`
  query Query($where: FeaturesWhereInput, $limit: Int) {
    features(where: $where, limit: $limit) {
      total
      data {
        Content1
        image
        title
      }
    }
  }
`;

export const QUERY_ALL_FAQ = gql`
  query Data($where: FaqWhereInput) {
    faqs(where: $where) {
      total
      data {
        _id
        answer
        createdAt
        createdBy {
          email
          _id
        }
        display
        question
        updatedAt
        updatedBy {
          _id
          email
        }
      }
    }
  }
`;

export const MUTATION_CONTACT = gql`
  mutation CreateContact($body: ContactInput!) {
    createContact(body: $body) {
      _id
    }
  }
`;
export const QUERY_USER = gql`
  query GetUser($where: UserWhereInput) {
    getUser(where: $where) {
      total
      data {
        _id
        otpQRcode
        base32
        email
        newName
      }
    }
  }
`;
export const QUERY_GENERAL_BUTTON_DOWNLOAD = gql`
  query Data($where: General_settingsWhereInput) {
    general_settings(where: $where) {
      data {
        action
      }
    }
  }
`;
export const QUERY_ADVERTISEMENT = gql`
  query Data($where: AdvertisementWhereInput) {
    getAdvertisement(where: $where) {
      data {
        _id
        url
        amountClick
      }
    }
  }
`;
export const CREATED_DETAIL_ADVERTISEMENT = gql`
  mutation CreateDetailadvertisements($data: DetailadvertisementsInput!) {
    createDetailadvertisements(data: $data) {
      _id
    }
  }
`;
