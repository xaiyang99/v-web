import jwtDecode from "jwt-decode";
import CryptoJS from "crypto-js";

const useDecodeToken = (token) => {
  const { REACT_APP_TOKEN_SECRET_KEY } = process.env;
  try {
    const decodedToken = jwtDecode(token);
    const data = decodedToken?.encryptedData;
    const secretKey = REACT_APP_TOKEN_SECRET_KEY;
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
    const lastestDecryptedDataes = JSON.parse(decryptedData);
    return lastestDecryptedDataes;
  } catch (error) {
    console.error(error);
  }
};

export default useDecodeToken;
