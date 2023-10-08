// @ts-nocheck
import {
  BookingPaymentStatusType,
  Store,
  StripeSubscriptionStatusType,
  User,
} from "db";
import clientRequest from "../client";
import { AxiosResponse, Method } from "axios";
import UserService from "server/src/services/UserService";
import StoreService, {
  updateStoreSettingDTOType,
} from "server/src/services/StoreService";
import RoomService from "server/src/services/RoomService";
import PaymentGatewayService from "server/src/services/PaymentGatewayService";
import PlanService from "server/src/services/PlanService";
import StoreBillingService from "server/src/services/StoreBillingService";
import BookingService from "server/src/services/BookingService";
import CustomerService from "server/src/services/CustomerService";
import GalleryService from "server/src/services/GalleryService";
import { createBookingDTOType } from "server";
import {
  deleteFileType,
  updateRoomType,
  updateRoomImageType,
  disabledBookingDateType,
  bookingCalendarType,
  createCustomerType,
  createRoomType,
} from "utils-data";

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
        return request("POST", "admin/users/logout");
      },
      register(payload: any) {
        return request("POST", "admin/auth/register", payload);
      },
      getSession(): Promise<
        AxiosResponse<Awaited<ReturnType<UserService["get"]>>>
      > {
        return request("GET", "admin/users/me");
      },
    },
    gallery: {
      upload(
        files: File[]
      ): Promise<
        AxiosResponse<Awaited<ReturnType<GalleryService["create"]>>[]>
      > {
        var data = new FormData();

        for (const file of files) {
          data.append(`files`, file);
        }
        return request("POST", "admin/gallery/upload", data);
      },
      list(): Promise<
        AxiosResponse<Awaited<ReturnType<GalleryService["list"]>>>
      > {
        return request("GET", "admin/gallery");
      },
      delete(
        payload: deleteFileType
      ): Promise<AxiosResponse<Awaited<ReturnType<GalleryService["delete"]>>>> {
        return request("DELETE", "admin/gallery", payload);
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
      setting(): Promise<
        AxiosResponse<Awaited<ReturnType<StoreService["getStoreSetting"]>>>
      > {
        return request("GET", "admin/stores/settings");
      },
      updateSetting(
        payload: updateStoreSettingDTOType
      ): Promise<
        AxiosResponse<Awaited<ReturnType<StoreService["updateStoreSetting"]>>>
      > {
        return request("PUT", "admin/stores/settings", payload);
      },
    },
    room: {
      create(
        payload: createRoomType
      ): Promise<AxiosResponse<Awaited<ReturnType<RoomService["create"]>>>> {
        return request("POST", "admin/rooms", payload);
      },
      update({
        id,
        payload,
      }: {
        id: string;
        payload: updateRoomType;
      }): Promise<AxiosResponse<Awaited<ReturnType<RoomService["update"]>>>> {
        return request("PUT", `admin/rooms/${id}`, payload);
      },

      upsertImage({
        id,
        payload,
      }: {
        id: string;
        payload: updateRoomImageType;
      }): Promise<AxiosResponse<Awaited<ReturnType<RoomService["update"]>>>> {
        return request("PUT", `admin/rooms/images/${id}`, payload);
      },

      deleteImage({
        id,
        payload,
      }: {
        id: string;
        payload: updateRoomImageType;
      }): Promise<AxiosResponse<Awaited<ReturnType<RoomService["update"]>>>> {
        return request("DELETE", `admin/rooms/images/${id}`, payload);
      },

      reorderImage({
        id,
        payload,
      }: {
        id: string;
        payload: updateRoomImageType;
      }): Promise<
        AxiosResponse<Awaited<ReturnType<RoomService["reorderImage"]>>>
      > {
        return request("PUT", `admin/rooms/reorderImages/${id}`, payload);
      },

      list(
        params: any
      ): Promise<AxiosResponse<Awaited<ReturnType<RoomService["list"]>>>> {
        return request("GET", "admin/rooms", params);
      },
      get(
        id: string
      ): Promise<AxiosResponse<Awaited<ReturnType<RoomService["get"]>>>> {
        return request("GET", `admin/rooms/${id}`);
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

      getStoreSubscriptionPlan(
        storeSubscriptionPlanid: string
      ): Promise<
        AxiosResponse<
          Awaited<ReturnType<StoreBillingService["getSubscription"]>>
        >
      > {
        return request(
          "GET",
          `admin/billing/subscribe/${storeSubscriptionPlanid}`
        );
      },
    },
    booking: {
      list(
        params: any
      ): Promise<AxiosResponse<Awaited<ReturnType<BookingService["list"]>>>> {
        return request("GET", "admin/booking", params);
      },
      create(
        payload: createBookingDTOType
      ): Promise<AxiosResponse<Awaited<ReturnType<BookingService["create"]>>>> {
        return request("POST", "admin/booking", payload);
      },
      getDisabledBookingDate(
        payload: disabledBookingDateType
      ): Promise<
        AxiosResponse<
          Awaited<ReturnType<BookingService["getDisabledBookingDate"]>>
        >
      > {
        return request("POST", "admin/booking/disabledDates", payload);
      },

      getRoomBookingPrice(
        payload: disabledBookingDateType
      ): Promise<
        AxiosResponse<
          Awaited<ReturnType<BookingService["getRoomBookingPrice"]>>
        >
      > {
        return request("POST", "admin/booking/bookingPrice", payload);
      },

      getBookingCalendar(
        payload: bookingCalendarType
      ): Promise<
        AxiosResponse<Awaited<ReturnType<BookingService["bookingCalendar"]>>>
      > {
        return request("POST", "admin/booking/calendar", payload);
      },
    },
    customer: {
      list(
        params: any
      ): Promise<AxiosResponse<Awaited<ReturnType<CustomerService["list"]>>>> {
        return request("GET", "admin/customer", params);
      },

      create(
        payload: createCustomerType
      ): Promise<
        AxiosResponse<Awaited<ReturnType<CustomerService["create"]>>>
      > {
        return request("POST", "admin/customer", payload);
      },
    },
  };
};

export default AdminApi;
