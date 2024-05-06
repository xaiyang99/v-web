import { gql } from "@apollo/client";

export const QUERY_INCOMES = gql`
  query GetIncomes(
    $noLimit: Boolean
    $limit: Int
    $skip: Int
    $orderBy: OrderByInput
    $where: PaymentWhereInput
  ) {
    getIncomes(
      noLimit: $noLimit
      limit: $limit
      skip: $skip
      orderBy: $orderBy
      where: $where
    ) {
      total
      totalAmount
      data {
        _id
        paymentId
        category
        paymentMethod
        amount
        description
        status
        createdAt
        updatedAt
        orderedAt
        advertisementId {
          _id
        }
        payerId {
          _id
        }
        packageId {
          _id
        }
      }
    }
  }
`;

export const QUERY_GET_ADVERTISING = gql`
  query GetAdvertisement(
    $where: AdvertisementWhereInput
    $orderBy: OrderByInput
    $skip: Int
    $limit: Int
    $noLimit: Boolean
  ) {
    getAdvertisement(
      where: $where
      orderBy: $orderBy
      skip: $skip
      limit: $limit
      noLimit: $noLimit
    ) {
      total
      data {
        adsNumber
        url
        updatedAt
        transferSlip
        status
        price
        currencyId {
          _id
          createdAt
          name
          status
          updatedAt
        }
        createdAt
        companyId {
          _id
          address
          createdAt
          email
          name
          phone
          status
          updatedAt
        }
        amountClick
        _id
      }
    }
  }
`;

export const MUTATION_CREATE_ADVERTISING = gql`
  mutation CreateAdvertisement($input: AdvertisementInput!) {
    createAdvertisement(input: $input) {
      _id
      amountClick
      companyId {
        _id
        address
        createdAt
        email
        name
        phone
        status
        updatedAt
      }
      createdAt
      currencyId {
        _id
        createdAt
        name
        status
        updatedAt
      }
      adsNumber
      price
      status
      transferSlip
      updatedAt
      url
    }
  }
`;

export const MUTATION_UPDATE_ADVERTISING = gql`
  mutation UpdateAdvertisement($id: ID!, $input: AdvertisementInput!) {
    updateAdvertisement(ID: $id, input: $input)
  }
`;

export const MUTATION_DELETE_ADVERTISING = gql`
  mutation DeleteAdvertisement($id: [ID!]) {
    deleteAdvertisement(ID: $id)
  }
`;

export const QUERY_GET_COMPANIES = gql`
  query GetPartner(
    $where: PartnerWhereInput
    $orderBy: OrderByInput
    $skip: Int
    $limit: Int
    $noLimit: Boolean
  ) {
    getPartner(
      where: $where
      orderBy: $orderBy
      skip: $skip
      limit: $limit
      noLimit: $noLimit
    ) {
      total
      data {
        _id
        address
        email
        name
        phone
        status
        updatedAt
        createdAt
      }
    }
  }
`;

export const QUERY_GET_CURRENCIES = gql`
  query GetCurrency(
    $where: CurrencyWhereInput
    $orderBy: OrderByInput
    $skip: Int
    $limit: Int
    $noLimit: Boolean
  ) {
    getCurrency(
      where: $where
      orderBy: $orderBy
      skip: $skip
      limit: $limit
      noLimit: $noLimit
    ) {
      total
      data {
        _id
        createdAt
        name
        status
        updatedAt
      }
    }
  }
`;

export const MUTATION_CREATE_INCOME = gql`
  mutation AddIncome($input: AddIncomeInput!) {
  addIncome(input: $input) {
    _id
  }
}
`;
