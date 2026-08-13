import axios, { AxiosError, type AxiosResponse, type InternalAxiosRequestConfig } from "axios";
import { encrypt, decrypt, generateSecreteKey } from "../../enc.js";
type EncryptedPayload = {
  part1: string;
  part2: string;
};

type EncryptedRequestConfig = InternalAxiosRequestConfig & {
  __secretKey?: string;
};

/** Paths that must send/receive plaintext (e.g. multipart upload / file download APIs). */
const SKIP_ENCRYPTION_PATHS = [
  "/dms-api/api/v1/thirdparty/upload-document",
  "/dms-api/api/v1/thirdparty/download-file",
  "/dms-api/pdf/generate",
] as const;

const shouldSkipEncryption = (url?: string): boolean => {
  if (!url) {
    return false;
  }

  try {
    const pathname = url.startsWith("http://") || url.startsWith("https://")
      ? new URL(url).pathname
      : url.split("?")[0];
    return SKIP_ENCRYPTION_PATHS.some(
      (path) => pathname === path || pathname.endsWith(path),
    );
  } catch {
    return SKIP_ENCRYPTION_PATHS.some((path) => url.includes(path));
  }
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

const readFormDataPayload = async (formData: FormData): Promise<unknown | null> => {
  const payloadEntry = formData.get("payload");
  if (payloadEntry == null) {
    return null;
  }

  if (typeof payloadEntry === "string") {
    return parseMaybeJson(payloadEntry);
  }

  if (typeof Blob !== "undefined" && payloadEntry instanceof Blob) {
    const text = await payloadEntry.text();
    return parseMaybeJson(text);
  }

  return null;
};

const appendJsonPayload = (formData: FormData, payload: unknown): void => {
  formData.append(
    "payload",
    new Blob([JSON.stringify(payload)], { type: "application/json" }),
  );
};

const rebuildFormDataWithoutPayload = (formData: FormData): FormData => {
  const nextFormData = new FormData();
  for (const [key, value] of formData.entries()) {
    if (key === "payload") {
      continue;
    }
    nextFormData.append(key, value);
  }
  return nextFormData;
};

const buildEncryptedFormData = (
  formData: FormData,
  plainPayload: unknown,
  secretKey: string,
): FormData => {
  const encryptedBody = encrypt(plainPayload, secretKey) as EncryptedPayload | undefined;
  if (!encryptedBody?.part1 || !encryptedBody?.part2) {
    throw new Error("Failed to encrypt FormData payload.");
  }

  const nextFormData = rebuildFormDataWithoutPayload(formData);
  appendJsonPayload(nextFormData, {
    part1: encryptedBody.part1,
    part2: encryptedBody.part2,
  });

  return nextFormData;
};

/** Ensure skip-encryption multipart `payload` has application/json part headers (matches Postman). */
const buildPlainJsonFormData = (formData: FormData, plainPayload: unknown): FormData => {
  const nextFormData = rebuildFormDataWithoutPayload(formData);
  appendJsonPayload(nextFormData, plainPayload);
  return nextFormData;
};

const encryptedClient = axios.create();

encryptedClient.interceptors.request.use(async (config: InternalAxiosRequestConfig) => {
  const mutableConfig = config as EncryptedRequestConfig;
  const skipEncryption = shouldSkipEncryption(mutableConfig.url);

  if (mutableConfig.data === undefined || mutableConfig.data === null) {
    return mutableConfig;
  }

  // Multipart: keep file binary; optionally encrypt JSON `payload` field.
  if (typeof FormData !== "undefined" && mutableConfig.data instanceof FormData) {
    const plainPayload = await readFormDataPayload(mutableConfig.data);

    console.log(
      "[API REQUEST]",
      mutableConfig.method?.toUpperCase(),
      mutableConfig.url,
      plainPayload ?? "[FormData]",
      skipEncryption ? "(encryption skipped)" : "",
    );

    if (plainPayload != null) {
      if (skipEncryption) {
        mutableConfig.data = buildPlainJsonFormData(mutableConfig.data, plainPayload);
      } else {
        const secretKey = generateSecreteKey(5);
        mutableConfig.data = buildEncryptedFormData(mutableConfig.data, plainPayload, secretKey);
        mutableConfig.__secretKey = secretKey;
      }
    }

    return mutableConfig;
  }

  console.log(
    "[API REQUEST]",
    mutableConfig.method?.toUpperCase(),
    mutableConfig.url,
    mutableConfig.data,
    skipEncryption ? "(encryption skipped)" : "",
  );

  if (skipEncryption) {
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

    // Decrypted response payload
    console.log(
      "[API RESPONSE]",
      requestConfig.method?.toUpperCase(),
      requestConfig.url,
      response.data,
    );

    return response;
  },
  (error: AxiosError) => {
    const requestConfig = error.config as EncryptedRequestConfig | undefined;

    if (error.response) {
      error.response.data = decryptResponseData(error.response.data, requestConfig?.__secretKey);

      console.log(
        "[API ERROR RESPONSE]",
        requestConfig?.method?.toUpperCase(),
        requestConfig?.url,
        error.response.data,
      );
    }

    return Promise.reject(error);
  },
);

export default encryptedClient;
