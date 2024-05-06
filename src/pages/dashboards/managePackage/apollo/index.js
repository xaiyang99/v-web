import { gql } from "@apollo/client";

export const QUERY_PACKAGE = gql`
  query GetPackages($limit: Int, $skip: Int, $where: PackageWhereInput) {
    getPackages(limit: $limit, skip: $skip, where: $where) {
      total
      data {
        _id
        packageId
        name
        category
        annualPrice
        monthlyPrice
        currencyId {
          _id
          name
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

export const DELETE_PACKAGE = gql`
  mutation DeletePackage($id: [ID!]!) {
    deletePackage(ID: $id)
  }
`;

export const CREATE_PACKAGE = gql`
  mutation CreatePackage($input: PackageInput!) {
    createPackage(input: $input) {
      _id
      status
    }
  }
`;

export const UPDATE_PACKAGE = gql`
  mutation UpdatePackage($input: PackageInput!, $id: ID) {
    updatePackage(input: $input, ID: $id)
  }
`;

export const QUERY_FEATURES_PACKAGE_LIST = gql`
  query Featurpackage(
    $noLimit: Boolean
    $limit: Int
    $skip: Int
    $orderBy: OrderByInput
    $where: FeaturpackageWhereInput
  ) {
    featurpackage(
      noLimit: $noLimit
      limit: $limit
      skip: $skip
      orderBy: $orderBy
      where: $where
    ) {
      total
      data {
        _id
        detial
        status
        createdAt
        updatedAt
        createdBy {
          _id
          firstName
          lastName
        }
        title
        subtitle
      }
    }
  }
`;

export const QUERY_CURRENCY = gql`
  query Data {
    getCurrency {
      data {
        _id
        name
        status
        createdAt
        createdBy {
          _id
          email
        }
        updatedAt
      }
    }
  }
`;
