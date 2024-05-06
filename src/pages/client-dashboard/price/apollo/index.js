import { gql } from "@apollo/client";

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

export const MUTATION_CREATE_PAYMENT = gql`
  mutation CreatePayment($input: CreatePaymentInput!) {
    createPayment(input: $input) {
      _id
      paymentId
      packageId {
        packageId
      }
      paymentMethod
      amount
      description
      status
      createdAt
      updatedAt
      orderedAt
    }
  }
`;

export const QUERY_PAYMENT = gql`
  query GetPayments($where: PaymentWhereInput) {
    getPayments(where: $where) {
      data {
        _id
      }
    }
  }
`;

export const QUERY_COUPON = gql`
  query Data($where: CouponWhereInput) {
    coupons(where: $where) {
      data {
        _id
        verifyCustomerID {
          _id
        }
        code
        amount
        status
        createdAt
        updatedAt
        verifyDate
        typeCouponID {
          _id
          typeCoupon
          startDate
          expird
          actionCoupon
          unit
          status
          createdAt
          updatedAt
        }
      }
    }
  }
`;

export const MUTATION_VERIFY_COUPON = gql`
  mutation VerifyCoupon($input: DiscountInput!) {
    verifyCoupon(input: $input) {
      _id
      typeCouponID {
        _id
        typeCoupon
        startDate
        expird
        actionCoupon
        unit
        statusCoupon
        status
        createdAt
        updatedAt
      }
      verifyCustomerID {
        _id
      }
      code
      amount
      status
      createdAt
      updatedAt
      verifyDate
    }
  }
`;

export const MUTATION_CHECKOUT = gql`
  mutation Checkout($input: CreatePaymentInput!) {
    checkout(input: $input) {
      data {
        _id
        paymentId
        packageId {
          _id
        }
        payerId {
          _id
        }
        advertisementId {
          _id
        }
        category
        paymentMethod
        amount
        description
        countBuyPayment
        status
        createdAt
        updatedAt
        orderedAt
      }
      secret
    }
  }
`;
