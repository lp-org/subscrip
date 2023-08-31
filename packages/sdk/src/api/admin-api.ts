import { NewRoom, Store, User } from "db";
import clientRequest from "../client";
import { AxiosResponse } from "axios";
import UserService from "server/src/services/UserService";
import StoreService from "server/src/services/StoreService";
import RoomService from "server/src/services/RoomService";
const AdminApi = (request: typeof clientRequest) => {
  return {
    user: {
      get(): Promise<AxiosResponse<User[]>> {
        return request("GET", "admin/users");
      },
    },
    auth: {
      login(payload: any) {
        return request("POST", "admin/auth/login", payload);
      },
      logout() {
        return request("POST", "admin/auth/logout");
      },
      register(payload: any) {
        return request("POST", "admin/auth/register", payload);
      },
      getSession(): Promise<
        AxiosResponse<Awaited<ReturnType<UserService["get"]>>>
      > {
        return request("GET", "admin/auth/me");
      },
    },
    store: {
      list(): Promise<AxiosResponse<Store[]>> {
        return request("GET", "admin/stores");
      },
      create({
        name,
      }: {
        name: string;
      }): Promise<AxiosResponse<Awaited<ReturnType<StoreService["create"]>>>> {
        return request("POST", "admin/stores", { name });
      },
    },
    room: {
      create(
        payload: NewRoom
      ): Promise<AxiosResponse<Awaited<ReturnType<RoomService["create"]>>>> {
        return request("POST", "admin/rooms", payload);
      },
      list(): Promise<AxiosResponse<Awaited<ReturnType<RoomService["list"]>>>> {
        return request("GET", "admin/rooms");
      },
    },
  };
};

export default AdminApi;
