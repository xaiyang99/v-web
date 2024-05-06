import { gql } from "@apollo/client";

export const ADMIN_LOGIN = gql`
  mutation StaffLogin($where: StaffLoginWhere!) {
    staffLogin(where: $where) {
      data {
        _id
        addProfile
        newName
        firstname
        lastname
        username
        gender
        email
        phone
        birthday
        position
        address
        country
        district
        village
        role {
          _id
          name
          status
        }
        status
        createdAt
        updatedAt
      }
      token
    }
  }
`;
export const USER_LOGIN = gql`
  mutation UserLogin($where: userLoginWhere!) {
    userLogin(where: $where) {
      token
      data {
        _id
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
        storage
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
        companyID {
          _id
          companyName
        }
        profile
        currentDevice
        newDevice
        twoFactorIsVerified
        twoFactorIsEnabled
        twoFactorQrCode
        twoFactorSecret
        createdAt
        updatedAt
      }
    }
  }
`;

export const QUERY_SINGLE_USER = gql`
  query GetUser(
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
        packageId {
          _id
          packageId
          name
          annualPrice
          monthlyPrice
          category
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
        otpEnabled
        otpVerified
        base32
        otpQRcode
        createdAt
        updatedAt
        companyID {
          _id
          companyName
        }
      }
      total
    }
  }
`;

export const QUERY_STAFF_LOGIN = gql`
  query QueryStaffs($where: StaffWhereInput) {
    queryStaffs(where: $where) {
      total
      data {
        _id
        firstname
        lastname
        gender
        email
        username
        newName
        birthday
        status
        phone
        position
        createdAt
        addProfile
        village
        district
        role {
          _id
          name
          status
        }
        address
      }
    }
  }
`;

export const MUTATION_VERIFY_2FA = gql`
  mutation Validate2FA($input: TwoFactorInput!, $id: ID!) {
    validate2FA(input: $input, ID: $id) {
      _id
    }
  }
`;
export const MUATION_FORGOT_PASS = gql`
  mutation ForgotPassword($email: String!) {
    forgotPassword(email: $email) {
      token
    }
  }
`;

export const MUTATION_RESET_PASS = gql`
  mutation ResetPassword(
    $token: String!
    $password: String
    $confirmPassword: String
  ) {
    resetPassword(
      token: $token
      password: $password
      confirmPassword: $confirmPassword
    ) {
      token
    }
  }
`;

export const CREATE_LOG = gql`
  mutation CreateLog($input: LogInput!) {
    createLog(input: $input) {
      _id
      refreshID
      name
    }
  }
`;
