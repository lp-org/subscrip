import { Store, User } from "db";
import clientRequest from "../client";
import { AxiosResponse } from "axios";
const AdminApi = {
  user: {
    get(): Promise<AxiosResponse<User[]>> {
      return clientRequest("GET", "admin/users");
    },
  },
  auth: {
    login(payload: any) {
      return clientRequest("POST", "admin/auth/login", payload);
    },
    logout() {
      return clientRequest("POST", "admin/auth/logout");
    },
    register(payload: any) {
      return clientRequest("POST", "admin/auth/register", payload);
    },
    getSession() {
      return clientRequest("GET", "admin/auth/me");
    },
  },
  store: {
    list(): Promise<AxiosResponse<Store[]>> {
      return clientRequest("GET", "admin/stores");
    },
  },
};

export default AdminApi;
