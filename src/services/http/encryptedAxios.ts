import axios, { AxiosError, type AxiosResponse, type InternalAxiosRequestConfig } from "axios";
import { encrypt, decrypt, generateSecreteKey } from "../../enc.js";
type EncryptedPayload = {
  part1: string;
  part2: string;
};

type EncryptedRequestConfig = InternalAxiosRequestConfig & {
  __secretKey?: string;
};

const isRecord = (value: unknown): value is Record<string, unknown> => {
  return typeof value === "object" && value !== null;
};

const isEncryptedPayload = (value: unknown): value is EncryptedPayload => {
  if (!isRecord(value)) {
    return false;
  }

  return typeof value.part1 === "string";
};

const parseMaybeJson = (value: unknown): unknown => {
  if (typeof value !== "string") {
    return value;
  }

  try {
    return JSON.parse(value);
  } catch {
    return value;
  }
};

const decryptResponseData = (data: unknown, secretKey?: string): unknown => {
  if (!secretKey || !isEncryptedPayload(data)) {
    return data;
  }

  const decrypted = decrypt(data.part1, secretKey);
  return parseMaybeJson(decrypted);
};

const encryptedClient = axios.create();

encryptedClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const mutableConfig = config as EncryptedRequestConfig;

  if (mutableConfig.data === undefined || mutableConfig.data === null) {
    return mutableConfig;
  }

  const secretKey = generateSecreteKey(5);
  const encryptedBody = encrypt(mutableConfig.data, secretKey) as EncryptedPayload;

  mutableConfig.data = {
    part1: encryptedBody.part1,
    part2: encryptedBody.part2,
  };
  mutableConfig.__secretKey = secretKey;

  return mutableConfig;
});

encryptedClient.interceptors.response.use(
  (response: AxiosResponse) => {
    const requestConfig = response.config as EncryptedRequestConfig;
    response.data = decryptResponseData(response.data, requestConfig.__secretKey);
    return response;
  },
  (error: AxiosError) => {
    const requestConfig = error.config as EncryptedRequestConfig | undefined;

    if (error.response) {
      error.response.data = decryptResponseData(error.response.data, requestConfig?.__secretKey);
    }

    return Promise.reject(error);
  },
);

export default encryptedClient;