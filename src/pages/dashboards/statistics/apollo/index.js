import { gql } from "@apollo/client";

export const QUERY_CUSTOMER = gql`
  query GetUser($where: UserWhereInput, $skip: Int, $limit: Int) {
    getUser(where: $where, skip: $skip, limit: $limit) {
      total
      data {
        _id
        lastLoggedInAt
        twoFactorIsEnabled
        createdAt
        provider
      }
    }
  }
`;
export const QUERY_LOG = gql`
  query GetLogs($where: LogParamsInput, $skip: Int, $limit: Int) {
    getLogs(where: $where, skip: $skip, limit: $limit) {
      total
      data {
        _id
        name
        status
        createdAt
        description
      }
    }
  }
`;
export const QUERY_FILES_STATISTICS = gql`
  query Files(
    $where: FilesWhereInput
    $orderBy: OrderByInput
    $skip: Int
    $limit: Int
  ) {
    files(where: $where, orderBy: $orderBy, skip: $skip, limit: $limit) {
      total
      data {
        _id
        updatedAt
        createdAt
        actionStatus
        size
      }
    }
  }
`;
export const QUERY_BROADCAST_STATISTICS = gql`
  query GetBroadcasts($where: BroadcastWhereInput) {
    getBroadcasts(where: $where) {
      total
      data {
        _id
        status
        createdAt
      }
    }
  }
`;
export const QUERY_COUPON = gql`
  query Coupons($where: CouponWhereInput) {
    coupons(where: $where) {
      total
      data {
        _id
        amount
        code
        updatedAt
        status
      }
    }
  }
`;
export const QUERY_ANNOUCEMENT = gql`
  query GetAnnouncements($where: AnnouncementWhereInput) {
    getAnnouncements(where: $where) {
      total
      data {
        _id
        createdAt
        updatedAt
        status
      }
    }
  }
`;

export const QUERY_TICKET = gql`
  query Tickets($where: TicketsWhereInput) {
    tickets(where: $where) {
      total
      data {
        _id
        createdAt
        status
      }
    }
  }
`;
export const QUERY_ADVERTISEMENT = gql`
  query GetAdvertisement($where: AdvertisementWhereInput) {
    getAdvertisement(where: $where) {
      total
      data {
        _id
        status
        createdAt
      }
    }
  }
`;
export const QUERY_FIRSTPURCHASE = gql`
  query FirstPurchaseAccount($where: PurchasePaymentWhereInput!) {
    queryPurchases(where: $where) {
      firstPurchaseAccount {
        _id
        paymentId
        category
        paymentMethod
        amount
        countBuyPayment
        status
        orderedAt
      }
    }
  }
`;
export const QUERY_REBILLSPURCHASE = gql`
  query FirstPurchaseAccount($where: PurchasePaymentWhereInput!) {
    queryPurchases(where: $where) {
      RebillsCount {
        _id
        paymentId
        paymentMethod
        amount
        countBuyPayment
        status
        orderedAt
      }
    }
  }
`;
export const QUERY_TOTALPURCHASE = gql`
  query FirstPurchaseAccount($where: PurchasePaymentWhereInput!) {
    queryPurchases(where: $where) {
      TotalPurchaseCount {
        _id
        amount
        countBuyPayment
        status
        orderedAt
        packageId {
          _id
          category
        }
      }
    }
  }
`;

export const QUERY_REFUNDS = gql`
  query FirstPurchaseAccount($where: PurchasePaymentWhereInput!) {
    queryPurchases(where: $where) {
      RefundsCount {
        _id
        amount
        countBuyPayment
        status
        orderedAt
      }
    }
  }
`;

export const QUERY_FILE_COUNTRY = gql`
  query Data($where: FilesWhereInput, $noLimit: Boolean) {
    files(where: $where, noLimit: $noLimit) {
      total
      data {
        _id
        country {
          _id
          name
          code
          iso
          avatar
          createdAt
          updatedAt
        }
        device
      }
    }
  }
`;
