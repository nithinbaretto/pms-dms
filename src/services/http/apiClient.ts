import encryptedClient from "./encryptedAxios";

export const apiPost = async <TResponse, TBody = unknown>(url: string, body?: TBody): Promise<TResponse> => {
  const response = await encryptedClient.post<TResponse>(url, body);
  return response.data;
};

export const apiPostFormData = async <TResponse>(url: string, formData: FormData): Promise<TResponse> => {
  // Let Axios set multipart boundary; do not force Content-Type manually.
  // Interceptor encrypts FormData `payload` and decrypts the encrypted response.
  const response = await encryptedClient.post<TResponse>(url, formData);
  return response.data;
};

export const apiGet = async <TResponse, TParams = unknown>(
  url: string,
  params?: TParams,
): Promise<TResponse> => {
  const response = await encryptedClient.get<TResponse>(url, { params });
  return response.data;
};
