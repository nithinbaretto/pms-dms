import encryptedClient from "./encryptedAxios";

export const apiPost = async <TResponse, TBody = unknown>(url: string, body?: TBody): Promise<TResponse> => {
  const response = await encryptedClient.post<TResponse>(url, body);
  return response.data;
};

export const apiGet = async <TResponse, TParams = unknown>(
  url: string,
  params?: TParams,
): Promise<TResponse> => {
  const response = await encryptedClient.get<TResponse>(url, { params });
  return response.data;
};
