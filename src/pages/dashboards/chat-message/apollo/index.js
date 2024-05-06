import { gql } from "@apollo/client";

export const CREATE_REPLY_MESSAGE = gql`
  mutation ReplyMessageAdmin($data: TicketsInput!, $request: Request) {
    createTickets(data: $data, request: $request) {
      _id
      image {
        _id
        image
        newNameImage
      }
    }
  }
`;

export const QUERY_CHAT_MESSAGE = gql`
  query getChatMessage(
    $where: TicketsWhereInput
    $limit: Int
    $orderBy: OrderByFolderAndFileInput
    $skip: Int
  ) {
    tickets(where: $where, limit: $limit, orderBy: $orderBy, skip: $skip) {
      total
      data {
        _id
        message
        status
        createdAt
        updatedAt
        typeTicketID {
          _id
          title
          email
          status
        }
        image {
          newNameImage
          image
        }
        createdByCustomer {
          _id
          newName
          firstName
          lastName
          email
        }
        createdByStaff {
          _id
          newName
        }
        replyMessage {
          _id
          message
        }
      }
    }
  }
`;
