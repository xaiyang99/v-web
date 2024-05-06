import { gql } from "@apollo/client";

export const QUERY_TICKET_BY_TYPE = gql`
  query getTicketTYPEByID(
    $where: TicketsWhereInput
    $limit: Int
    $orderBy: OrderByFolderAndFileInput
    $noLimit: Boolean
  ) {
    tickets(
      where: $where
      limit: $limit
      orderBy: $orderBy
      noLimit: $noLimit
    ) {
      total
      data {
        _id
        message
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
        }
        replyMessage {
          _id
          message
        }
      }
    }
  }
`;
