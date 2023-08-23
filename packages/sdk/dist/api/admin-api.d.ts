import { Store, User } from "db";
import { AxiosResponse } from "axios";
declare const AdminApi: {
    user: {
        get(): Promise<AxiosResponse<User[]>>;
    };
    auth: {
        login(payload: any): Promise<AxiosResponse<any, any>>;
        logout(): Promise<AxiosResponse<any, any>>;
        register(payload: any): Promise<AxiosResponse<any, any>>;
        getSession(): Promise<AxiosResponse<any, any>>;
    };
    store: {
        list(): Promise<AxiosResponse<Store[]>>;
    };
};
export default AdminApi;
//# sourceMappingURL=admin-api.d.ts.map