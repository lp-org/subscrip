import { NewCustomerType, NewRoom, Store, User } from "db";
import clientRequest from "../client";
import { AxiosResponse } from "axios";
import UserService from "server/src/services/UserService";
import StoreService, { updateStoreSettingDTOType } from "server/src/services/StoreService";
import RoomService from "server/src/services/RoomService";
import PaymentGatewayService from "server/src/services/PaymentGatewayService";
import PlanService from "server/src/services/PlanService";
import StoreBillingService from "server/src/services/StoreBillingService";
import BookingService from "server/src/services/BookingService";
import CustomerService from "server/src/services/CustomerService";
import GalleryService from "server/src/services/GalleryService";
import { createBookingDTOType } from "server";
import { deleteFileType, updateRoomType, updateRoomImageType, disabledBookingDateType, bookingCalendarType } from "utils-data";
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
    gallery: {
        upload(files: File[]): Promise<AxiosResponse<Awaited<ReturnType<GalleryService["create"]>>[]>>;
        list(): Promise<AxiosResponse<Awaited<ReturnType<GalleryService["list"]>>>>;
        delete(payload: deleteFileType): Promise<AxiosResponse<Awaited<ReturnType<GalleryService["delete"]>>>>;
    };
    store: {
        list(): Promise<AxiosResponse<Store[]>>;
        create({ name, }: {
            name: string;
        }): Promise<AxiosResponse<Awaited<ReturnType<StoreService["create"]>>>>;
        setting(): Promise<AxiosResponse<Awaited<ReturnType<StoreService["getStoreSetting"]>>>>;
        updateSetting(payload: updateStoreSettingDTOType): Promise<AxiosResponse<Awaited<ReturnType<StoreService["updateStoreSetting"]>>>>;
    };
    room: {
        create(payload: NewRoom): Promise<AxiosResponse<Awaited<ReturnType<RoomService["create"]>>>>;
        update({ id, payload, }: {
            id: string;
            payload: updateRoomType;
        }): Promise<AxiosResponse<Awaited<ReturnType<RoomService["update"]>>>>;
        upsertImage({ id, payload, }: {
            id: string;
            payload: updateRoomImageType;
        }): Promise<AxiosResponse<Awaited<ReturnType<RoomService["update"]>>>>;
        deleteImage({ id, payload, }: {
            id: string;
            payload: updateRoomImageType;
        }): Promise<AxiosResponse<Awaited<ReturnType<RoomService["update"]>>>>;
        reorderImage({ id, payload, }: {
            id: string;
            payload: updateRoomImageType;
        }): Promise<AxiosResponse<Awaited<ReturnType<RoomService["reorderImage"]>>>>;
        list(params: any): Promise<AxiosResponse<Awaited<ReturnType<RoomService["list"]>>>>;
        get(id: string): Promise<AxiosResponse<Awaited<ReturnType<RoomService["get"]>>>>;
    };
    plan: {
        list(): Promise<AxiosResponse<Awaited<ReturnType<PlanService["list"]>>>>;
    };
    billing: {
        session(): Promise<AxiosResponse<Awaited<ReturnType<PaymentGatewayService["createSession"]>>>>;
        getPaymentMethod(id: string): Promise<AxiosResponse<Awaited<ReturnType<PaymentGatewayService["getPaymentMethod"]>>>>;
        mySubscription(filter: any): Promise<AxiosResponse<Awaited<ReturnType<StoreBillingService["getMySubscription"]>>>>;
        subscribe(planId: string): Promise<AxiosResponse<Awaited<ReturnType<StoreBillingService["subscribePlan"]>>>>;
    };
    booking: {
        list(params: any): Promise<AxiosResponse<Awaited<ReturnType<BookingService["list"]>>>>;
        create(payload: createBookingDTOType): Promise<AxiosResponse<Awaited<ReturnType<BookingService["create"]>>>>;
        getDisabledBookingDate(payload: disabledBookingDateType): Promise<AxiosResponse<Awaited<ReturnType<BookingService["getDisabledBookingDate"]>>>>;
        getRoomBookingPrice(payload: disabledBookingDateType): Promise<AxiosResponse<Awaited<ReturnType<BookingService["getRoomBookingPrice"]>>>>;
        getBookingCalendar(payload: bookingCalendarType): Promise<AxiosResponse<Awaited<ReturnType<BookingService["bookingCalendar"]>>>>;
    };
    customer: {
        list(params: any): Promise<AxiosResponse<Awaited<ReturnType<CustomerService["list"]>>>>;
        create(payload: NewCustomerType): Promise<AxiosResponse<Awaited<ReturnType<CustomerService["create"]>>>>;
    };
};
export default AdminApi;
//# sourceMappingURL=admin-api.d.ts.map