import { axiosClient } from "sdk";

export default axiosClient({
  baseURL: process.env.BACKEND_URL || "http://localhost:5000",
});
