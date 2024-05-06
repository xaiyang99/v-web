import { sign, verify } from "jsonwebtoken";
import { accessTokenLocalKey, decryptTokenDataNew } from "../functions";
import axios from "./axios";

const { REACT_APP_TOKEN_SECRET_KEY } = process.env;

const isValidToken = (accessToken) => {
  try {
    if (!accessToken) {
      return false;
    }
    const decoded = accessToken;
    const userPayload = decryptTokenDataNew(
      decoded,
      REACT_APP_TOKEN_SECRET_KEY,
    );
    const currentTime = Date.now() / 1000;
    return (userPayload || decoded).exp > currentTime;
  } catch (e) {
    return false;
  }
};

const setSession = (accessToken) => {
  if (accessToken) {
    // localStorage.setItem("accessToken", accessToken);
    localStorage.setItem(accessTokenLocalKey, accessToken);
    axios.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
  } else {
    // localStorage.removeItem("accessToken");
    localStorage.removeItem(accessTokenLocalKey);
    delete axios.defaults.headers.common.Authorization;
  }
};

export { isValidToken, setSession, sign, verify };
