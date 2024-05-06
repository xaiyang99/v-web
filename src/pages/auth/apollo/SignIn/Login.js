import { gql } from "@apollo/client";

export const LOGIN_USER = gql`
  mutation UserLogin($where: userLoginWhere!) {
    userLogin(where: $where) {
      token
      data {
        _id
        firstName
        lastName
        gender
        profile
        username
        email
      }
    }
  }
`;

export const QUERY_USER = gql`
  query Data($where: UserWhereInput) {
    users(where: $where) {
      data {
        email
        firstname
        lastname
        _id
      }
    }
  }
`;

export const MUTATION_GOOGLE_AUTH = gql`
  mutation LoginWithGoogle($dataInput: tokenInput!, $loginFrom: LoginFrom) {
    loginWithGoogle(dataInput: $dataInput, loginFrom: $loginFrom) {
      data {
        _id
        accountId
        provider
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
      token
    }
  }
`;

export const MUTATION_FACEBOOK_OAUTH = gql`
  mutation LoginWithFacebook(
    $dataInput: dataUserFacebook!
    $loginFrom: LoginFrom
  ) {
    loginWithFacebook(dataInput: $dataInput, loginFrom: $loginFrom) {
      data {
        _id
        accountId
        provider
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
      token
    }
  }
`;
