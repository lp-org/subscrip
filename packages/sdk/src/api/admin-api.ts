import { NewRoom, Store, User } from "db";
import clientRequest from "../client";
import { AxiosResponse } from "axios";
import UserService from "server/src/services/UserService";
import StoreService from "server/src/services/StoreService";
import RoomService from "server/src/services/RoomService";
import PaymentGatewayService from "server/src/services/PaymentGatewayService";
import PlanService from "server/src/services/PlanService";
import StoreBillingService from "server/src/services/StoreBillingService";
import BookingService from "server/src/services/BookingService";
import { createBookingDTOType } from "server";
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
      list(
        params: any
      ): Promise<AxiosResponse<Awaited<ReturnType<RoomService["list"]>>>> {
        return request("GET", "admin/rooms", params);
      },
    },
    plan: {
      list(): Promise<AxiosResponse<Awaited<ReturnType<PlanService["list"]>>>> {
        return request("GET", "admin/plans");
      },
    },

    billing: {
      session(): Promise<
        AxiosResponse<
          Awaited<ReturnType<PaymentGatewayService["createSession"]>>
        >
      > {
        return request("POST", "admin/billing/session");
      },

      getPaymentMethod(
        id: string
      ): Promise<
        AxiosResponse<
          Awaited<ReturnType<PaymentGatewayService["getPaymentMethod"]>>
        >
      > {
        return request("GET", `admin/billing/paymentMethod/${id}`);
      },

      mySubscription(
        filter: any
      ): Promise<
        AxiosResponse<
          Awaited<ReturnType<StoreBillingService["getMySubscription"]>>
        >
      > {
        return request("GET", "admin/billing/store-subscription", filter);
      },

      subscribe(
        planId: string
      ): Promise<
        AxiosResponse<Awaited<ReturnType<StoreBillingService["subscribePlan"]>>>
      > {
        return request("POST", "admin/billing/subscribe", { planId });
      },
    },
    booking: {
      create(
        payload: createBookingDTOType
      ): Promise<AxiosResponse<Awaited<ReturnType<BookingService["create"]>>>> {
        return request("POST", "admin/booking", payload);
      },
    },
  };
};

export default AdminApi;
