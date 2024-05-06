import { gql } from "@apollo/client";

export const QUERY_BROADCAST = gql`
  query Data(
    $where: BroadcastWhereInput
    $orderBy: OrderByInput
    $skip: Int
    $limit: Int
  ) {
    getBroadcasts(
      where: $where
      orderBy: $orderBy
      skip: $skip
      limit: $limit
    ) {
      total
      data {
        _id
        title
        content
        startDate
        endDate
        image
        status
        createdAt
        updatedAt
        createdBy {
          _id
          email
        }
      }
    }
  }
`;
export const DELETE_BROADCAST = gql`
  mutation DeleteBroadcast($id: [ID!]!) {
    deleteBroadcast(ID: $id)
  }
`;
export const UPDATE_BROADCAST = gql`
  mutation UpdateBroadcast($input: UpdateBroadcastInput!, $id: ID) {
    updateBroadcast(input: $input, ID: $id) {
      _id
    }
  }
`;

export const CREATE_BROADCAST = gql`
  mutation CreateBroadcast($input: CreateBroadcastInput!) {
    createBroadcast(input: $input) {
      _id
    }
  }
`;
export const SEND_BROADCAST = gql`
  mutation CreateBroadcastDetail($input: CreateBroadcastDetailInput!) {
    createBroadcastDetail(input: $input)
  }
`;
