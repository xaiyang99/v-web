import { gql } from "@apollo/client";

export const QUERY_CUSTOMERS = gql`
  query Data(
    $where: UserWhereInput
    $orderBy: OrderByInput
    $skip: Int
    $limit: Int
    $noLimit: Boolean
  ) {
    getUser(
      where: $where
      orderBy: $orderBy
      skip: $skip
      limit: $limit
      noLimit: $noLimit
    ) {
      data {
        _id
        username
        gender
        country
        countryId {
          _id
          name
          code
          iso
          avatar
          createdAt
          updatedAt
        }
        createdAt
        updatedAt
      }
    }
  }
`;

export const QUERY_PACKAGES = gql`
  query Data(
    $noLimit: Boolean
    $limit: Int
    $skip: Int
    $orderBy: OrderByInput
    $where: PackageWhereInput
  ) {
    getPackage(
      noLimit: $noLimit
      limit: $limit
      skip: $skip
      orderBy: $orderBy
      where: $where
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

export const QUERY_PAYMENTS = gql`
  query Data(
    $orderBy: OrderByInput
    $where: PaymentWhereInput
    $skip: Int
    $limit: Int
    $noLimit: Boolean
  ) {
    getPayments(
      orderBy: $orderBy
      where: $where
      skip: $skip
      limit: $limit
      noLimit: $noLimit
    ) {
      data {
        _id
        paymentId
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
          twoFactorSecret
          twoFactorQrCode
          twoFactorIsEnabled
          twoFactorIsVerified
          createdAt
          updatedAt
          lastLoggedInAt
          codeAnonymous
          anonymousExpired
          storage
        }
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
        paymentMethod
        status
        createdAt
        updatedAt
        orderedAt
        amount
        category
        description
        countBuyPayment
      }
      total
    }
  }
`;

export const QUERY_TICKETS = gql`
  query Data($noLimit: Boolean) {
    tickets(noLimit: $noLimit) {
      data {
        _id
        message
        status
        statusRead
        createdAt
        updatedAt
        typeTicketID {
          _id
          status
        }
      }
      total
    }
  }
`;

export const QUERY_PERMISSION = gql`
  query Permision($where: Role_staffWhereInput) {
    role_staffs(where: $where) {
      data {
        _id
        name
        permision {
          _id
          groupName
          name
          status
        }
      }
    }
  }
`;
