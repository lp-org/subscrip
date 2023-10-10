import { AxiosResponse } from "axios";
import { User } from "db";
import clientRequest from "../client";
import StoreService from "server/src/services/StoreService";
import RoomService from "server/src/services/RoomService";
import { createBookingDTOType } from "server";
import BookingService from "server/src/services/BookingService";
import { disabledBookingDateType, bookingCalendarType } from "utils-data";

// @ts-ignore
type AxiosReturn<T> = Promise<AxiosResponse<Awaited<ReturnType<T>>>>;

const StoreFrontApi = (request: typeof clientRequest) => {
  return {
    store: {
      get(site: string): Promise<AxiosResponse<any>> {
        return request("GET", `store/store/${site}`);
      },
      getSetting(id: string): AxiosReturn<StoreService["getStoreSetting"]> {
        return request("GET", `store/store/setting/${id}`);
      },
    },
    room: {
      list(params: any): AxiosReturn<RoomService["list"]> {
        return request("GET", "store/rooms", params);
      },
      get(id: string): AxiosReturn<RoomService["get"]> {
        return request("GET", `store/rooms/${id}`);
      },
    },
    booking: {
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
    },
  };
};

export default StoreFrontApi;
