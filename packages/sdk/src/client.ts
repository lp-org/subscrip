import axios, { Method } from "axios";

const client = axios.create({
  // eslint-disable-next-line turbo/no-undeclared-env-vars
  baseURL: process.env.BACKEND_URL || "http://localhost:5000",
});

export default function medusaRequest(method: Method, path = "", payload = {}) {
  const options = {
    method,
    withCredentials: true,
    url: path,
    data: payload,
    json: true,
  };
  return client(options);
}
