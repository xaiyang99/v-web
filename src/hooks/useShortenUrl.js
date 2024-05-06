import axios from "axios";
const {
  REACT_APP_SHORTEN_URL_API,
  REACT_APP_SHORTEN_SECRET_TOKEN_KEY,
  REACT_APP_SHORTEN_SECRET_ENCRYPTED,
} = process.env;
import CryptoJS from "crypto-js";

const useShortenURL = async ({ url }) => {
  try {
    const headers = {
      Authorization: "Bearer " + REACT_APP_SHORTEN_SECRET_TOKEN_KEY,
      "Content-Type": "application/json",
    };
    const secretKey = REACT_APP_SHORTEN_SECRET_ENCRYPTED;

    const encryptedHeaders = CryptoJS.AES.encrypt(
      JSON.stringify(headers),
      secretKey,
    );

    const res = await axios.post(
      REACT_APP_SHORTEN_URL_API,
      {
        linkToShorten: url,
      },
      {
        headers: {
          encryptedheaders: encryptedHeaders,
        },
      },
    );

    return res.data?.response;
  } catch (error) {
    console.log(error);
  }
};

export default useShortenURL;
