import { gql } from "@apollo/client";
export const QUERY_PAYMENTS = gql`
  query GetPayments(
    $where: PaymentWhereInput
    $orderBy: OrderByInput
    $skip: Int
    $limit: Int
    $noLimit: Boolean
  ) {
    getPayments(
      where: $where
      orderBy: $orderBy
      skip: $skip
      limit: $limit
      noLimit: $noLimit
    ) {
      total
      data {
        _id
        paymentId
        packageId {
          _id
          packageId
          name
          category
          annualPrice
          monthlyPrice
          discount
          description
          storage
          annualPrice
          monthlyPrice
          ads
          captcha
          multipleUpload
          numberOfFileUpload
          uploadPerDay
          fileUploadPerDay
          maxUploadSize
          multipleDownload
          downLoadOption
          support
          sort
          totalUsed
          textColor
          bgColor
          status
          createdAt
          updatedAt
        }
        payerId {
          _id
          accountId
          provider
          firstName
          lastName
          gender
          phone
          email
          username
          newName
          address
          state
          zipCode
          country
          ip
          device
          browser
          status
          profile
          currentDevice
          newDevice
          createdAt
          updatedAt
          codeAnonymous
          anonymousExpired
        }
        paymentMethod
        amount
        status
        createdAt
        orderedAt
        updatedAt
      }
      totalAmount
    }
  }
`;

export const QUERY_INVOICES = gql`
  query GetInvoice(
    $where: InvoiceWhereInput
    $orderBy: OrderByInput
    $skip: Int
    $limit: Int
    $noLimit: Boolean
  ) {
    getInvoice(
      where: $where
      orderBy: $orderBy
      skip: $skip
      limit: $limit
      noLimit: $noLimit
    ) {
      data {
        _id
        invoiceId
        customerId {
          _id
        }
        packageId {
          _id
        }
        paymentId {
          _id
        }
        name
        amount
        status
        createdAt
        updatedAt
        createdBy {
          _id
        }
      }
    }
  }
`;

export const QUERY_PAYMENTS_OPTIONS = gql`
  query GetPayments(
    $where: PaymentWhereInput
    $orderBy: OrderByInput
    $skip: Int
    $limit: Int
    $noLimit: Boolean
  ) {
    getPayments(
      where: $where
      orderBy: $orderBy
      skip: $skip
      limit: $limit
      noLimit: $noLimit
    ) {
      data {
        _id
        paymentId
      }
    }
  }
`;

export const MUTATION_CREATE_INVOICE = gql`
  mutation CreateInvoice($input: InvoiceInput!) {
    createInvoice(input: $input) {
      _id
      invoiceId
      name
      amount
      status
      createdAt
      updatedAt
    }
  }
`;

export const MUTATION_DELETE_PAYMENT = gql`
  mutation DeletePayment($id: [ID!]) {
    deletePayment(ID: $id)
  }
`;

export const QUERY_PACKAGES = gql`
  query GetPackage(
    $where: PackageWhereInput
    $orderBy: OrderByInput
    $skip: Int
    $limit: Int
    $noLimit: Boolean
  ) {
    getPackage(
      where: $where
      orderBy: $orderBy
      skip: $skip
      limit: $limit
      noLimit: $noLimit
    ) {
      data {
        _id
        packageId
        name
        category
        annualPrice
        monthlyPrice
        currencyId {
          _id
        }
        discount
        description
        storage
        ads
        captcha
        fileDrop
        multipleUpload
        numberOfFileUpload
        uploadPerDay
        fileUploadPerDay
        maxUploadSize
        multipleDownload
        downLoadOption
        support
        batchDownload
        unlimitedDownload
        customExpiredLink
        downloadFolder
        remoteUpload
        iosApplication
        androidApplication
        sort
        totalUsed
        textColor
        bgColor
        status
        createdAt
        updatedAt
        createdBy {
          firstName
          lastName
        }
      }
      total
    }
  }
`;

export const QUERY_PACKAGES_OPTIONS = gql`
  query GetPackage(
    $where: PackageWhereInput
    $orderBy: OrderByInput
    $skip: Int
    $limit: Int
    $noLimit: Boolean
  ) {
    getPackage(
      where: $where
      orderBy: $orderBy
      skip: $skip
      limit: $limit
      noLimit: $noLimit
    ) {
      total
      data {
        _id
        name
        packageId
      }
    }
  }
`;

export const QUERY_CUSTOMERS = gql`
  query GetCustomer(
    $params: CustomerWhereInput
    $orderBy: OrderByInput
    $skip: Int
    $limit: Int
    $noLimit: Boolean
  ) {
    getCustomer(
      params: $params
      orderBy: $orderBy
      skip: $skip
      limit: $limit
      noLimit: $noLimit
    ) {
      data {
        _id
        firstName
        lastName
        username
        status
        profile
        createdAt
        updatedAt
      }
    }
  }
`;

export const MUTATION_SEND_INVOICE = gql`
  mutation SendInvoiceToCustomerInPayment($id: ID!) {
    sendInvoiceToCustomerInPayment(ID: $id)
  }
`;

export const MUTATION_SEND_RECEIPT = gql`
  mutation SendReceiptToCustomerInPayment($id: ID!) {
    sendReceiptToCustomerInPayment(ID: $id)
  }
`;
