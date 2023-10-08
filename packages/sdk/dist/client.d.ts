import { AxiosRequestConfig, Method } from "axios";
export declare const client: import("axios").AxiosInstance;
export declare const axiosClient: (option: AxiosRequestConfig) => import("axios").AxiosInstance;
export default function clientRequest(method: Method, path?: string, payload?: {}): Promise<import("axios").AxiosResponse<any, any>>;
//# sourceMappingURL=client.d.ts.map