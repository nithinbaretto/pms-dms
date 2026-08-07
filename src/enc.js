// @ts-nocheck
import JSEncrypt from "jsencrypt";
import CryptoJS from "crypto-js";

export const generateSecreteKey = (length) => {
  let chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ",
    result = "";
  for (let i = length; i > 0; --i)
    result += chars[Math.round(Math.random() * (chars.length - 1))];
  return result;
};

export const createRequestIds = (id, secret) => {
  let length = Math.floor(Math.random() * 10) + 3;
  let salt = Math.floor(Math.random() * 10) + 4;
  let requestId =
    Math.random().toString(36).substring(2, length) +
    Math.random().toString(36).substring(2, salt) +
    id;

  let secretNew = secret + generateSecreteKey(requestId.length);
  let latestTransaction = {
    requestId: requestId,
    secret: secretNew,
  };

  return latestTransaction;
};

export const encrypt = (text, secret) => {
  try {
    let sign = new JSEncrypt();
    let public_key =
      "MIICIjANBgkqhkiG9w0BAQEFAAOCAg8AMIICCgKCAgEAm4YSPse3/wkLjY+VSRm+xh+Yus8Gp+U9itVIciQCp/WyY2hjkG5dkHslPkkNoY3k+fSRmCSckjP2TZUHi7oF4ezI1+l7ZPj7wkJpW/7FF0ocS8eEyHuhoSWQbqjo8daBC+erwm/Q/KUYQMdebdvZ4p4be4K+A/NvEyTx59UMlxZpZ7+HUXdamf3SbZowmUH4ibEvtonttJRGHBLgtSKvXu4Z/h34of6hV8pHV8etvWssZrj+l+ru9oBhuQYb3ZJuNFO9qrNZn9gcv84Hr8PFXeDv/KcEhEPXYBOEhSMu+jjOU9N3k1mIWU/SgosvStTQofhP7e8fhYNrd7fU9zYzbFm37loN1GCSLX6aXDTtSxoJxNHBK53mug02crZL3HlQBlZ2ytW+WkI05NUNXJxXxlsrehRJEr7nwp7QWFkAD+fOnf57zsWR8656H+n3ctrw+qFzfz5f2WWAArwqZ467s3LKhk+gor5JvFpYDcCCNzf0g2ZO9IHzcI7CVt/Vr6IWkzthUlPJ54KYqOdOWl+Yeg/qPR9yYzNnSKZjNzwvUmFeTFNof5LOecmJjHgaZkkbWg4Uy2C1cBGbF3ZwGQmd/jg71ksW5eBv2Sf1KZd2tbxuBPml6zRpmyBMsCm6CgJOH2XTI3u0yyrtSZje5uTAT1DZJUXHEmZ10QBos3lz+yMCAwEAAQ==";

    sign.setPublicKey(public_key);
    let s = sign.encrypt(secret);
    let salt = CryptoJS.lib.WordArray.random(128 / 8);
    let iv = CryptoJS.lib.WordArray.random(128 / 8);
    let cryptoKey = CryptoJS.PBKDF2(secret, salt, {
      keySize: 256 / 32,
      iterations: 100,
    });

    let encrypted = CryptoJS.AES.encrypt(JSON.stringify(text), cryptoKey, {
      iv: iv,
      padding: CryptoJS.pad.Pkcs7,
      mode: CryptoJS.mode.CBC,
    });
    let transitmessage = {
      part1: salt.toString() + iv.toString() + encrypted.toString(),
      part2: s,
    };
    return transitmessage;
  } catch (e) {
    return undefined;
  }
};

export const decrypt = (text, secret) => {
  let key = CryptoJS.PBKDF2(
    secret,
    CryptoJS.enc.Hex.parse(text.substring(0, 32)),
    { keySize: 256 / 32, iterations: 100 }
  );

  let decrypted = CryptoJS.AES.decrypt(
    text.substring(64),
    key,
    {
      iv: CryptoJS.enc.Hex.parse(text.substring(32, 64)),
      padding: CryptoJS.pad.Pkcs7,
      mode: CryptoJS.mode.CBC,
    }
  );

  return JSON.parse(decrypted.toString(CryptoJS.enc.Utf8));
};
