import axios, { AxiosRequestConfig, Method } from "axios";

export const client = axios.create({
  // eslint-disable-next-line turbo/no-undeclared-env-vars
  baseURL: process.env.BACKEND_URL || "http://localhost:5000",
});
export const axiosClient = (option: AxiosRequestConfig) => {
  return axios.create(option);
};

export default function clientRequest(method: Method, path = "", payload = {}) {
  const options: AxiosRequestConfig = {
    method,
    withCredentials: true,
    url: path,
    data: payload,
  };

  return client(options);
}
