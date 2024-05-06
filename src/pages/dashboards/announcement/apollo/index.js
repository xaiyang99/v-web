import { gql } from "@apollo/client";

export const QUERY_ANOUNCEMENT = gql`
  query GetAnnouncements(
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
        audience
        content
        endDate
        image
        status
        title
        startDate
        endDate
      }
    }
  }
`;

export const MUTATION_CREATE_ANNOUNCEMENT = gql`
  mutation CreateAnnouncement($input: AnnouncementInput!) {
    createAnnouncement(input: $input) {
      _id
      image
    }
  }
`;

export const DELETE_ANNOUNCEMENT = gql`
  mutation DeleteAnnouncement($id: [ID!]!) {
    deleteAnnouncement(ID: $id)
  }
`;

export const UPDATE_ANNOUNCEMENT = gql`
  mutation UpdateAnnouncement($input: AnnouncementInput!, $id: ID) {
    updateAnnouncement(input: $input, ID: $id) {
      _id
      image
    }
  }
`;

export const UPDATE_RECIPIENT_ANNOUNCEMENTS = gql`
  mutation UpdateRecipientAnnouncement(
    $input: UpdateRecipientAnnouncementInput!
    $id: ID
  ) {
    updateRecipientAnnouncement(input: $input, ID: $id) {
      _id
    }
  }
`;

export const CRATE_RECIPIENT_ANNOUCEMENTS = gql`
  mutation CreateRecipientAnnouncement(
    $input: CreateRecipientAnnouncementInput!
  ) {
    createRecipientAnnouncement(input: $input) {
      _id
    }
  }
`;

export const QUERY_RECIPIENT = gql`
  query GetRecipientAnnouncementByUserId(
    $where: RecipientAnnouncementByIdWhereInput
    $orderBy: OrderByInput
    $limit: Int
    $skip: Int
  ) {
    getRecipientAnnouncementByUserId(
      where: $where
      orderBy: $orderBy
      limit: $limit
      skip: $skip
    ) {
      total
      data {
        _id
        announcementId {
          _id
          title
          content
          startDate
          endDate
          image
          audience
          status
          createdAt
          updatedAt
        }
        status
        createdAt
        updatedAt
      }
    }
  }
`;
