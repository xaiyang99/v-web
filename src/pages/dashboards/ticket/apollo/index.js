import { gql } from "@apollo/client";

export const QUERY_TICKET = gql`
  query getTicket(
    $limit: Int
    $skip: Int
    $orderBy: OrderByFolderAndFileInput
    $where: TicketsWhereInput
  ) {
    tickets(limit: $limit, skip: $skip, orderBy: $orderBy, where: $where) {
      data {
        _id
        title
        description
        image
        status
        customerEmail
        createdAt
        updatedAt
      }
      total
    }
  }
`;

export const QUERY_TICKET_TYPE = gql`
  query Typetickets(
    $limit: Int
    $skip: Int
    $orderBy: OrderByFolderAndFileInput
    $where: TypeticketsWhereInput
  ) {
    typetickets(limit: $limit, skip: $skip, orderBy: $orderBy, where: $where) {
      total
      data {
        _id
        title
        email
        expired
        status
        code
        updatedAt
        createdAt
        createdBy {
          _id
          firstName
          lastName
          profile
          phone
          email
          newName
        }
      }
    }
  }
`;

export const CREATE_TICKET = gql`
  mutation CreateTickets($data: TicketsInput!) {
    createTickets(data: $data) {
      _id
      image {
        _id
        image
        newNameImage
      }
    }
  }
`;

export const CREATE_TYPE_TICKET = gql`
  mutation CreateTypetickets($data: TypeticketsInput!) {
    createTypetickets(data: $data) {
      _id
    }
  }
`;

export const UPDATE_TICKET = gql`
  mutation UpdateTickets($data: TicketsInput!, $where: TicketsWhereOneInput!) {
    updateTickets(data: $data, where: $where) {
      _id
    }
  }
`;

export const UPDATE_TYPE_TICKET = gql`
  mutation UpdateTypetickets(
    $data: TypeticketsInput!
    $where: TypeticketsWhereOneInput!
  ) {
    updateTypetickets(data: $data, where: $where) {
      _id
    }
  }
`;

export const DELETE_TICKET = gql`
  mutation DeleteTickets($where: TicketsWhereOneInput!) {
    deleteTickets(where: $where) {
      _id
    }
  }
`;

export const DELETE_TYPE_TICKET = gql`
  mutation DeleteTypetickets($where: TypeticketsWhereOneInput!) {
    deleteTypetickets(where: $where) {
      _id
    }
  }
`;
