import { NewRoom, Store, User } from "db";
import clientRequest from "../client";
import { AxiosResponse } from "axios";
import UserService from "server/src/services/UserService";
import StoreService from "server/src/services/StoreService";
import RoomService from "server/src/services/RoomService";
declare const AdminApi: (request: typeof clientRequest) => {
    user: {
        get(): Promise<AxiosResponse<User[]>>;
    };
    auth: {
        login(payload: any): Promise<AxiosResponse<any, any>>;
        logout(): Promise<AxiosResponse<any, any>>;
        register(payload: any): Promise<AxiosResponse<any, any>>;
        getSession(): Promise<AxiosResponse<Awaited<ReturnType<UserService["get"]>>>>;
    };
    store: {
        list(): Promise<AxiosResponse<Store[]>>;
        create({ name, }: {
            name: string;
        }): Promise<AxiosResponse<Awaited<ReturnType<StoreService["create"]>>>>;
    };
    room: {
        create(payload: NewRoom): Promise<AxiosResponse<Awaited<ReturnType<RoomService["create"]>>>>;
        list(): Promise<AxiosResponse<Awaited<ReturnType<RoomService["list"]>>>>;
    };
};
export default AdminApi;
//# sourceMappingURL=admin-api.d.ts.map