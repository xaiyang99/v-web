/* eslint-disable no-prototype-builtins */
import CryptoJS from "crypto-js";

import { format } from "date-fns";
import { Base64 } from "js-base64";
import jwtDecode from "jwt-decode";
import _ from "lodash";
import moment from "moment";

// format time-line chat with date time
export const getTimeLineChat = (date) => {
  const dateNow =
    moment(new Date()).format("HH:mm") === moment(date).format("HH:mm");

  if (dateNow) {
    return "Just now";
  }

  return moment(date).format("HH:mm").toString();
};

// format chat history with yesterday
export function isChatYesterday(dateStr) {
  const inputDate = new Date(dateStr.split("-").reverse().join("-"));
  const currentDate = new Date();

  currentDate.setDate(currentDate.getDate() - 1);

  return (
    inputDate.getDate() === currentDate.getDate() &&
    inputDate.getMonth() === currentDate.getMonth() &&
    inputDate.getFullYear() === currentDate.getFullYear()
  );
}

// only number input
export function inputNumberOnly(event) {
  if (!/[0-9]/.test(event.key)) {
    event.preventDefault();
  }
}

// format money
export const currency = (value) => {
  let currencys = new Intl.NumberFormat("en-CA").format(value);
  if (value !== 0) return currencys;
  else if (value === 0) return "0";
  else return "";
};

// limit row page
export const rowItems = 10;
// formate create date
export function DateFormat(dateTime) {
  const dateString = dateTime;
  const date = new Date(dateString);
  const formattedDate = date
    .toLocaleDateString("en-US", {
      day: "numeric",
      month: "long",
      year: "numeric",
    })
    .replace(",", "");
  return formattedDate;
}
// fomate percent 100,000 %
export function formatePercentString(percent) {
  const roundedPercent = (percent / 100).toLocaleString("en-Us", {
    style: "percent",
    minimumFractionDigits: 0,
    maximumFractionDigits: 1,
  });
  return roundedPercent;
}
export function formattedAmount(amount) {
  const roundedPercent = amount.toLocaleString("en-Us", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
  return roundedPercent;
}

// formate date number
export function DateOfNumber(dateTime) {
  if (dateTime) {
    const date = moment(dateTime).format("DD-MM-YYYY");
    return date;
  }
}

// formate date number
export function DateOfNumberFormat(dateTime) {
  if (dateTime) {
    const date = moment(dateTime).format("dd/mm/yyyy");
    return date;
  }
}

export function getDateFormate(dateTime) {
  if (dateTime) {
    const date = moment(dateTime).format("DD-MM-YYYY h:mm:ss");
    return date;
  }
}

export function getDateFormateYYMMDD(dateTime) {
  if (dateTime) {
    const date = moment(dateTime).format("YYYY-MM-DD h:mm:ss");
    return date;
  }
}

export const linkSocketIO = process.env.REACT_APP_API_SOCKET;

//link bunny cnd
export const linkBunnyCDN = process.env.REACT_APP_BUNNY_URL;
export const keyBunnyCDN = process.env.REACT_APP_ACCESSKEY_BUNNY;
export const previewImage = `${process.env.REACT_APP_BUNNY_PULL_ZONE}image/`;
export const bunnyImagePublic =
  process.env.REACT_APP_BUNNY_IMAGE_PUBLIC + "/image";

// captcha key
export const recaptchaKey = process.env.REACT_APP_RECAPTCHA_KEY;

// local storage key
export const accessTokenLocalKey = process.env.REACT_APP_ACCESS_TOKEN_KEY;
export const userDataLocalKey = process.env.REACT_APP_USER_DATA_KEY;
export const permissionLocalKey = process.env.REACT_APP_PERMISSION_LOCAL_KEY;
export const folderIdLocalKey = process.env.REACT_APP_FOLDER_ID_LOCAL_KEY;
export const dateForgetLocalKey = process.env.REACT_APP_DATE_FORGET_LOCAL_KEY;

export function ConvertBytetoMBandGB(size) {
  const sizeInBytes = size;
  const sizeInKB = sizeInBytes / 1000;
  const sizeInMB = sizeInBytes / (1000 * 1000);
  const sizeInGB = sizeInBytes / (1000 * 1000 * 1000);
  const sizeInTB = sizeInBytes / (1000 * 1000 * 1000 * 1000);
  if (sizeInBytes < 1000) {
    const GB = sizeInBytes;
    return GB + " B";
  } else if (sizeInBytes >= 1000 && sizeInBytes < 1000 * 1000) {
    const GB = sizeInKB.toFixed(2);
    return GB + " KB";
  } else if (sizeInBytes >= 1000 * 1000 && sizeInBytes < 1000 * 1000 * 1000) {
    const GB = sizeInMB.toFixed(2);
    return GB + " MB";
  } else if (sizeInBytes >= 1000 * 1000 * 1000 * 1000) {
    const TB = sizeInTB.toFixed(2);
    return TB + " TB";
  } else {
    const GB = sizeInGB.toFixed(2);
    return GB + " GB";
  }
}

export function CutfileName(filename, fileNewName) {
  if (!fileNewName) {
    return filename;
  }
  if (filename && fileNewName) {
    const newName = filename.replace(fileNewName, "");
    return newName;
  }
}

export const ConvertStorage = ({ data, byte }) => {
  if (byte === "GB") {
    let GB = data * 1000 * 1000 * 1000;
    return GB;
  } else if (byte === "TB") {
    let TB = data * 1000 * 1000 * 1000 * 1000;
    return TB;
  } else if (byte === "MB") {
    let MB = data * 1000;
    return MB;
  }
};

export const ConvertBinaryToByte = ({ data, byte }) => {
  if (byte === "MB") {
    let convered = data / (1000 * 1000);
    return convered;
  } else if (byte === "GB") {
    let convered = data / (1000 * 1000 * 1000);

    return convered;
  } else if (byte === "TB") {
    let convered = data / (1000 * 1000 * 1000 * 1000);
    return convered;
  }
};

// get file type for show icons == pdf
export function GetFileType(name) {
  if (!name) {
    return null;
  }
  const fileName = name;
  const fileType = fileName?.split(".").pop();

  return fileType;
}

// check that is file of folder
export function getFileExtension(item) {
  const lastDotIndex = item.lastIndexOf(".");
  const fileType = lastDotIndex === -1 ? "" : item.slice(lastDotIndex);
  if (fileType === "") {
    return true;
  } else {
    return false;
  }
}

// cut .pdf of file out
export function CutFileType(name) {
  const fileName = name;
  const regex = /^(.+)\.\w+$/;
  const match = regex.exec(fileName);
  if (match) {
    const name = match[1];
    return name;
  }
}

// a function to remove the date and time from a string
export function extractFileNames(fileList) {
  return fileList.substring(19);
}

// get the first part of the path
export function extractDirectoryName(path) {
  if (!path) {
    return null;
  } else {
    const parts = path.split("/");
    return parts[parts.length - 2];
  }
}

// cut (1) out
export function CutAddNumberOut(name) {
  const originalFileName = name;
  const newName = originalFileName.replace(/\(\d\)/, "");
  return newName;
}

export function getFileNameExtension(filename) {
  const dotIndex = filename?.lastIndexOf(".");
  if (dotIndex !== -1) {
    const fileExtension = filename?.slice?.(dotIndex);
    return fileExtension;
  } else {
    return "";
  }
}

export function getFilenameWithoutExtension(filename) {
  const dotIndex = filename?.lastIndexOf(".");
  if (dotIndex > 0) {
    return filename.slice(0, dotIndex);
  } else {
    return filename;
  }
}

// get folder name from path
export function GetFolderName(path) {
  if (!path) {
    return null;
  }
  const str = path;
  const parts = str.split("/");
  const firstPart = parts[0];
  return firstPart;
}

export function GetFileTypeFromFullType(fileType) {
  if (!fileType) {
    return null;
  }
  return fileType?.split("/")[0] || fileType;
}

export function GetCurrentDateTime() {
  const options = {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    timeZone: "Asia/Bangkok",
    hour12: false,
  };
  const formatter = new Intl.DateTimeFormat("th", options);
  const dateTime = formatter.format(new Date());
  return dateTime;
}

// cut first 8 charecters out
export function truncateFileName(fileName) {
  if (fileName.length <= 8) {
    return fileName;
  } else {
    const truncatedFileName = fileName.slice(0, 8) + "_" + fileName.slice(-4);
    return truncatedFileName;
  }
}

// function cut file name out Test(1)/Folder/sss.jpg => Test(1)/Folder/
export function truncateName(path) {
  var folder_name = path?.match(/^(.+)\//)?.[1];
  return folder_name + "/";
}

// 2022-06-12T10:58:57.000Z => 12-06-2023
export function formatMomentDate(date) {
  const dateTime = moment(date);
  const dateOnly = dateTime.format("DD-MM-YYYY");
  return dateOnly;
}

// Sat Jun 10 2023 17:16:33 GMT+0700 (Indochina Time) => 10-06-2023
export function formatIndochinaDate(dated) {
  const date = new Date(dated);
  const formattedDate = format(date, "dd-MM-yyyy");
  return formattedDate;
}

export const cutStringWithEllipsis = (
  inputString,
  maxLength,
  cutSpecificLength = 0,
) => {
  if (inputString) {
    const givenLength = cutSpecificLength || maxLength;

    const subString = inputString.substring(0, givenLength);

    return subString.length === inputString.length
      ? inputString
      : subString + "...";
  }
  return;
};

export const capitalizeFirstLetter = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

const SECRET_KEY = process.env.REACT_APP_SECRET_KEY;
const LOCAL_SECRET_KEY = process.env.REACT_APP_LOCAL_STORAGE_SECRET_KEY;

export const encryptData = (param) => {
  const encrypted = CryptoJS.AES.encrypt(param, LOCAL_SECRET_KEY).toString();
  return encodeURIComponent(encrypted);
};
// Function to decrypt a parameter
export const decryptData = (encryptedParam) => {
  try {
    const decrypted = CryptoJS.AES.decrypt(
      decodeURIComponent(encryptedParam),
      LOCAL_SECRET_KEY,
    ).toString(CryptoJS.enc.Utf8);
    return decrypted;
  } catch (error) {
    return null;
  }
};

// gen new name for file function
export const genNewFileName = (name) => {
  try {
    const newName =
      Base64.encode(GetCurrentDateTime() + name) + "." + GetFileType(name);
    return newName;
  } catch (error) {
    return null;
  }
};

// Get space error
export const cutSpaceError = (error) => {
  if (!error) {
    return null;
  }
  const errorMessage = error;
  const startIndex = errorMessage.indexOf("Not enough size");
  const endIndex = errorMessage.indexOf(",SpacePackage");
  const result = errorMessage.substring(startIndex, endIndex);
  if (result === "Not enough size") {
    return true;
  }
  return false;
};

// check that folder or file function
export const checkThatFolderOrFile = (path) => {
  if (!path) {
    return false;
  } else {
    const splitPath = path.split("/");
    if (splitPath.length > 1) {
      return true;
    } else {
      return false;
    }
  }
};

// compare date to  GMT+0700 (Indochina Time)
export const compareDateToIndochinaTime = (date) => {
  const indochinaTime = new Date(Date.parse(date));
  return indochinaTime;
};
// compare date Indochina to general
export const compareIndochinaDateToGeneral = (indochinadate) => {
  const date = moment(indochinadate).format("YYYY-MM-DD h:mm:ss");
  return date;
};
export const indexPagination = ({ filter, index }) => {
  const indexPageNumber =
    index + (filter?.currentPageNumber * filter?.pageLimit - filter?.pageLimit);

  return indexPageNumber;
};
// rest api create log and query log
export const createLog_api = process.env.REACT_APP_CREATE_LOG;

export const handleCreateLogs = (name, infor, _id) => {
  const axios = require("axios");
  let data = JSON.stringify({
    name: name,
    description: infor,
    createdBy: _id,
  });

  let config = {
    method: "post",
    maxBodyLength: Infinity,
    url: createLog_api,
    headers: {
      "Content-Type": "application/json",
    },
    data: data,
  };

  axios
    .request(config)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      return error;
    });
};

// generate unique 15 letter function
export const generateRandomString = () => {
  // define the pool of characters to choose from
  let characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  let result = "";
  for (let i = 0; i < 8; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    const randomCharacter = characters.charAt(randomIndex);
    result += randomCharacter;
    characters =
      characters.slice(0, randomIndex) + characters.slice(randomIndex + 1);
  }
  const now = new Date();
  const timestamp = `${now.getFullYear()}${now.getMonth()}${now.getDate()}${now.getHours()}${now.getMinutes()}${now.getSeconds()}`;
  const encryptedTimestamp = btoa(timestamp).substring(0, 7);
  result += encryptedTimestamp;

  return result;
};

export const generateUniqueId = (prefix = "") => {
  const timestamp = new Date().getTime().toString(36);
  const randomPart = Math.random().toString(36).substring(2, 5);

  return `${prefix}${timestamp}${randomPart}`.toUpperCase();
};

export const generateRandomStringWithLength = (length = 5) => {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

export const generateUniqueBase64 = (length = 16) => {
  const randomBase64 = CryptoJS.lib.WordArray.random(length)
    .toString(CryptoJS.enc.Base64)
    .replaceAll(/[+=/]/g, generateRandomStringWithLength(1));
  return randomBase64;
};

export const generateRandomUniqueNumber = () => {
  const timestamp = new Date().getTime();
  const randomDigits = Math.floor(1000 + Math.random() * 9000);
  const uniqueId = timestamp + randomDigits;

  return uniqueId;
};

export const getNameFromUrl = (data) => {
  const url = data;
  if (!data) {
    return null;
  }
  const parts = url.split("/");
  const lastPart = parts.pop();

  return lastPart;
};

export const formatDateTimeFromPicker = (dateTime) => {
  if (!dateTime) {
    return null;
  }
  const date = new Date(dateTime);
  date.setDate(date.getDate() + 1);
  const isoDateString = date.toISOString();
  const desiredDateFormat = isoDateString.substring(0, 10) + " 13:46:37";
  return desiredDateFormat;
};

export const isValueOrNull = (value, falsyValue) => {
  if (value && value !== "null") {
    return value;
  }
  return falsyValue;
};

export function encryptId(id, secretKey) {
  const encryptedID = CryptoJS.AES.encrypt(id, secretKey).toString();
  return encodeURIComponent(encryptedID);
}

export function decryptId(encryptedId, secretKey) {
  const decryptedBytes = CryptoJS.AES.decrypt(
    decodeURIComponent(encryptedId),
    secretKey,
  );
  const decryptedID = decryptedBytes.toString(CryptoJS.enc.Utf8);
  return decryptedID;
}

export function validatePhoneRegExp(phoneNumber) {
  const regex = /^\d{10}$/;
  return regex.test(phoneNumber);
}
export function isValidEmail(data) {
  const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return regex.test(data);
}

// get the last element of path: http://localhost:3000/dashboard/seo => result: seo
export function getRouteName(route) {
  const lastElement = route.split("/").slice(-1)[0];
  if (lastElement === "") {
    const routeName = "landing-page";
    return routeName;
  }
  return lastElement;
}

// get date current month and date lasted year  12 month ago

export function currentDateAndLastYearDate(value, date) {
  const elevenMonthsAgo = new Date(date);
  if (value === "weekly") {
    elevenMonthsAgo.setDate(date.getDate() - 6);
  } else if (value === "monthly") {
    elevenMonthsAgo.setMonth(date?.getMonth() - 12);
  } else {
    elevenMonthsAgo.setYear(date?.getYear() - 12);
    elevenMonthsAgo.setFullYear(date.getFullYear() - 5);
  }
  // Format the dates if needed
  const formattedCurrentDate = date.toISOString().split("T")[0];
  const formattedYearlyAgo = elevenMonthsAgo.toISOString().split("T")[0];
  return { startDate: formattedCurrentDate, endDate: formattedYearlyAgo };
}

export function prettyNumberFormat(
  number,
  options = {},
  defaultValue = "00.00",
) {
  return (number || defaultValue).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    ...options,
  });
}

// Retrieve the safety property of objects
export function safeGetProperty(obj, prop, defaultValue = null) {
  if (prop?.includes(".")) {
    const keys = prop.split(".");
    const result = keys.reduce((acc, key) => {
      return acc && acc.hasOwnProperty(key) ? acc[key] : undefined;
    }, obj);

    return result !== undefined ? result : defaultValue;
  } else {
    return obj && obj.hasOwnProperty(prop) ? obj[prop] : defaultValue;
  }
}

export const modifyProperty = (path, obj) => {
  return path.split(".").reduce(function (prev, cur) {
    return prev ? prev[cur] : null;
  }, obj || self);
};

// formate view k and m used chart
export function formateViews(views) {
  if (views >= 1000000) {
    return (views / 1000000).toFixed(1) + "M";
  } else if (views >= 1000) {
    return (views / 1000).toFixed(1) + "K";
  } else {
    return views.toString();
  }
}

// calculate stepsize used chart
export function stepSizeChart(stepSize) {
  if (stepSize < 11) {
    return 2;
  } else if (stepSize < 10 && stepSize <= 20) {
    return 4;
  } else if (stepSize > 20 && stepSize <= 50) {
    return 6;
  } else if (stepSize > 50 && stepSize < 100) {
    return 10;
  } else if (stepSize > 100 && stepSize < 1000) {
    return 100;
  } else if (stepSize > 1000 && stepSize < 10000) {
    return 1000;
  } else if (stepSize > 10000 && stepSize < 100000) {
    return 10000;
  } else if (stepSize > 100000 && stepSize < 1000000) {
    return 100000;
  } else if (stepSize > 1000000 && stepSize < 10000000) {
    return 1000000;
  } else if (stepSize > 10000000 && stepSize < 100000000) {
    return 10000000;
  }
}

// calcultate time
export function calculateTime(time) {
  const seconds = time / 1000;
  if (seconds < 60) {
    return `${seconds} s`;
  } else if (seconds < 3600) {
    const minutes = Math.floor(seconds / 60);
    return `${minutes} mn${minutes !== 1 ? "s" : ""}`;
  } else {
    const hours = Math.floor(seconds / 3600);
    const remainingMinutes = Math.floor((seconds % 3600) / 60);
    return `${hours} h${hours !== 1 ? "s" : ""} and ${remainingMinutes} mn${
      remainingMinutes !== 1 ? "s" : ""
    }`;
  }
}

//calculate percent increase or decreasing from last year to this year
export const calculatePercentFromLastYearToThisYear = (
  inputThisYearNumber,
  inputLastYearNumber,
) => {
  if (inputLastYearNumber !== 0) {
    return Math.round(
      ((inputThisYearNumber - inputLastYearNumber) / inputLastYearNumber) * 100,
    );
  } else {
    return 0;
  }
};

//accumulate an array to a number
export const accumulateArray = (inputArray, inputKey = "") => {
  return (inputArray || []).reduce(
    (accumulator, currentValue) =>
      accumulator +
      (inputKey
        ? Number(safeGetProperty(currentValue, inputKey, 0))
        : currentValue),
    0,
  );
};

//covert a number to a pretty string
export const intToPrettyString = (inputNumber) => {
  const num = parseFloat(
    (inputNumber || 0)?.toString().replace(/[^0-9.,-]/g, ""),
  );

  if (isNaN(num)) {
    return "Invalid Number";
  }

  if (num < 1000 && num > -1000) {
    return num.toString();
  }

  const isNegative = num < 0;
  const absoluteNum = Math.abs(num);

  const si = [
    { v: 1e18, s: "E" },
    { v: 1e15, s: "P" },
    { v: 1e12, s: "T" },
    { v: 1e9, s: "B" },
    { v: 1e6, s: "M" },
    { v: 1e3, s: "K" },
  ];

  for (let index = 0; index < si.length; index++) {
    if (absoluteNum >= si[index].v) {
      const formattedNum = (absoluteNum / si[index].v)
        .toFixed(2)
        .replace(/\.0+$|(\.[0-9]*[1-9])0+$/, "$1");

      return (isNegative ? "-" : "") + formattedNum + si[index].s;
    }
  }

  return (isNegative ? "-" : "") + absoluteNum.toString();
};

export const stringPluralize = (count, str, suffix = "s") => {
  let res = `${str}${count > 1 ? suffix : count < 0 ? suffix : ""}`;
  return `${res}`;
};

export const numberWithCommas = (inputNumber) => {
  if (!inputNumber) {
    return;
  }
  return inputNumber
    ?.toString()
    ?.replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
};

export const ordinalSuffixOf = (inputNumber) => {
  let j = inputNumber % 10,
    k = inputNumber % 100;
  if (j === 1 && k !== 11) {
    return inputNumber + "st";
  }
  if (j === 2 && k !== 12) {
    return inputNumber + "nd";
  }
  if (j === 3 && k !== 13) {
    return inputNumber + "rd";
  }
  return inputNumber + "th";
};

//find the Top list in an array;
/*example usage
  const mockUser = [
    { name: "1", country: "LA" },
    { name: "2", country: "TH" },
    { name: "3", country: "AM" },
    { name: "4", country: "BU" },
  ];
  findTopValueInArray(mockUser, "country", 3); // get only top 3
*/

export const findTopValueInArray = (
  inputList,
  accessKey,
  displayKey,
  topNumberInput,
) => {
  const list = inputList?.reduce((prev, cur) => {
    const prevName = safeGetProperty(cur, accessKey);
    const displayName = safeGetProperty(cur, displayKey);
    _.set(
      prev,
      prevName,
      safeGetProperty(prev, prevName) || {
        _title: displayName,
        count: 0,
        items: [],
      },
    );

    let prevCount = safeGetProperty(prev, `${prevName}.count`);
    let prevItem = safeGetProperty(prev, `${prevName}.items`);
    prevCount++;
    prevItem.push({ ...cur });
    const pc = prevCount;
    const pi = prevItem;
    _.set(prev, `${prevName}.count`, pc);
    _.set(prev, `${prevName}.items`, pi);
    return prev;
  }, {});

  const result = Object.entries(list)
    .map((data) => ({
      ...data[1],
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, topNumberInput);
  return result;
};

export const errorWrapper = (func) => {
  return function (...args) {
    try {
      return func(...args);
    } catch (error) {
      console.error("Error caught:", error);
    }
  };
};

export const decryptTokenDataNew = (encryptData, secretKey) => {
  try {
    //for dev
    const decodedToken = jwtDecode(encryptData);
    const data = decodedToken?.encryptedData;
    const key = CryptoJS.enc.Utf8.parse(secretKey);
    const parts = data.split(":");
    const ciphertext1 = CryptoJS.enc.Base64.parse(parts[0]);
    const parsedIv = CryptoJS.enc.Base64.parse(parts[1]);
    const decrypted = CryptoJS.AES.decrypt({ ciphertext: ciphertext1 }, key, {
      iv: parsedIv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    });
    const decryptData = decrypted.toString(CryptoJS.enc.Utf8);
    const decryptedData = JSON.parse(decryptData);
    return decryptedData;
    //for prod
    /* const decodedToken = jwtDecode(encryptData);
      const encryptedDataDecodedToken = decodedToken?.encryptedData;
      const decryptedData = CryptoJS.AES.decrypt(
        encryptedDataDecodedToken,
        secretKey,
      ).toString(CryptoJS.enc.Utf8);

      return JSON.parse(decryptedData); */
  } catch (e) {
    console.log(e);
    return false;
  }
};

export const generateRandomName = () => {
  const vowels = "aeiou";
  const consonants = "bcdfghjklmnpqrstvwxyz";
  let name = "";

  const nameLength = Math.floor(Math.random() * (8 - 3 + 1)) + 3;

  for (let i = 0; i < nameLength; i++) {
    if (i % 2 === 0) {
      name += consonants.charAt(Math.floor(Math.random() * consonants.length));
    } else {
      name += vowels.charAt(Math.floor(Math.random() * vowels.length));
    }
  }

  name = name.charAt(0).toUpperCase() + name.slice(1);

  return name;
};

export const saveSvgToFile = (svgString, fileName) => {
  if (svgString) {
    const blob = new Blob([svgString], { type: "image/svg+xml" });
    const file = new File([blob], fileName + ".svg", { type: "image/svg+xml" });
    return file;
  }
  return false;
};

export const handleGraphqlErrors = (message) => {
  switch (message) {
    case "Error: EMAIL_ALREADY_IN_USED": {
      return "Email has already been used";
    }

    case "Error: JsonWebTokenError: jwt malformed": {
      return null;
    }

    case "LOGIN_IS_REQUIRED": {
      return "Please log in to continue";
    }

    case "SOCKETSERVER_IS_NOT_INITIALIZED": {
      return "We have troube with Socker server, Please try again later!";
    }

    case "THE_FOLDER_NAME_IS_REPEATED": {
      return "The folder name is repeated";
    }

    case "THE_FILE_NAME_IS_REPEATED": {
      return "The file name is repeated";
    }

    case "ຊື່ໄຟລ": {
      return "File name already exists";
    }

    case "USERNAME_ALREADY_IN_USED": {
      return "Username already in use by another account";
    }

    case "INVALID_EMAIL_FORMAT": {
      return "Please enter a valid email address";
    }

    case "CAN'T_NOT_UPDATE_EMAIL_PLEASE_SEND_OTP": {
      return "Unable to update email. Please send OTP for verification";
    }

    case "TOKEN_EXPIRED": {
      return "Your token has expired. Please log in again";
    }

    case "EMAIL_NOT_FOUND": {
      return "Email address not found";
    }

    case "USER_NOT_FOUND": {
      return "User account not found";
    }

    case "LIMITED": {
      return "Filedrop was limited access. Please try again later";
    }

    case "YOUR_ACCOUNT_HAS_BEEN_DISABLED": {
      return "This account has been disabled";
    }

    case "PASSWORD_INCORRECT": {
      return "Invalid password";
    }

    case "PASSWORD_NOT_MATCH": {
      return "Password dot not matched";
    }

    case "YOUR_ACCOUNT_HAS_BEEN_DELETED": {
      return "This account has been deleted";
    }

    case "NOT_FOUND_YOUR_ACCOUNT": {
      return "This account is not found";
    }

    case "PASSWORD_MUST_BE_AT_LEAST_8_CHARACTERS": {
      return "The password must be at least 8 characters";
    }

    case "NOT_UPDATE": {
      return "Update data is not successfully";
    }

    case "FILE_NAME_DOES_NOT_HAVE_AN_EXTENSION": {
      return "The file name missing an extension";
    }

    case "THE_FILE_NAME_IS_REPEATED": {
      return "The file name is duplicated";
    }

    case "THE_FOLDER_NAME_IS_REPEATED": {
      return "The folder name is duplicated";
    }

    default: {
      return message;
    }
  }
};
