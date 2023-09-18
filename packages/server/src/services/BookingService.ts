import { PgJsDatabaseType, booking, customer, pricing, room } from "db";
import { RESOLVER } from "awilix";
import { CurrentStore } from "../types";
import { BaseService } from "../interfaces/base-service";
import { z } from "zod";
import dayjs from "dayjs";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import isBetween from "dayjs/plugin/isBetween";
import localeData from "dayjs/plugin/localeData";
import { and, or, between, eq, gte, isNotNull } from "drizzle-orm";
import RoomService from "./RoomService";
import { createBookingDTO } from "utils-data";
import { whereEqQuery } from "../utils/build-query";

dayjs.extend(isSameOrBefore);
dayjs.extend(isBetween);
dayjs.extend(localeData);
type InjectedDependencies = {
  db: PgJsDatabaseType;
  currentStore: CurrentStore;
  currentUser: Express.User;
  roomService: RoomService;
};

type BookingType = Partial<typeof booking.$inferSelect>;
export default class BookingService extends BaseService {
  static [RESOLVER] = {};
  protected override readonly db_: PgJsDatabaseType;
  protected override readonly currentStore_: CurrentStore;
  protected readonly currentUser_: Express.User;
  protected readonly roomService_: RoomService;
  constructor({
    db,
    currentStore,
    roomService,
    currentUser,
  }: InjectedDependencies) {
    super({
      db,
      currentStore,
    });
    this.db_ = db;
    this.currentStore_ = currentStore;
    this.roomService_ = roomService;
    this.currentUser_ = currentUser;
  }

  async create(data: z.infer<typeof createBookingDTO>) {
    const validated = createBookingDTO.parse(data);
    return this.db_.transaction(async (tx) => {
      const valid = await this.getIsBookingValid(
        validated.roomId,
        validated.checkInDate,
        validated.checkOutDate
      );
      if (!valid) {
        throw new Error("Check in date & checkout-out date is not valid");
      }
      return await tx.insert(booking).values({
        checkInDate: validated.checkInDate,
        checkOutDate: validated.checkOutDate,
        roomId: validated.roomId,
        createdBy: this.currentUser_.userId,
        totalAmount: validated.totalAmount,
        customerId: validated.customerId,
        status: "booked",
        storeId: this.currentStore_.storeId,
      });
    });
  }

  async list(filter: BookingType) {
    const where = await this.whereEqQueryByStore(filter, booking);
    const bookingData = await this.db_
      .select({
        id: booking.id,
        customerEmail: customer.email,
        bookingNo: booking.bookingNo,
        checkInDate: booking.checkInDate,
        checkOutDate: booking.checkOutDate,
      })
      .from(booking)
      .leftJoin(customer, eq(booking.customerId, customer.id))
      .where(and(...where));
    const count = await this.listCountByStore(and(...where), booking);
    return { booking: bookingData, count };
  }

  async getDisabledBookingDate(
    roomId: string,
    startDate: string,
    endDate: string
  ) {
    if (dayjs(endDate).isSameOrBefore(dayjs(startDate))) {
      throw new Error("The check in date and check out date is not valid");
    }
    const days = [];
    let tempStartDate = startDate;

    while (dayjs(tempStartDate).isSameOrBefore(endDate)) {
      days.push(dayjs(tempStartDate).format("YYYY-MM-DD"));
      tempStartDate = dayjs(tempStartDate).add(1, "day").format("YYYY-MM-DD");
    }

    const selectedBooking = await this.db_
      .select()
      .from(booking)

      .where(
        and(
          or(
            between(booking.checkInDate, startDate, endDate),
            between(booking.checkOutDate, startDate, endDate)
          ),
          eq(booking.roomId, roomId),
          eq(booking.status, "booked")
        )
      );
    const bookedDays: { [x: string]: number } = {};
    days.forEach((day) => {
      selectedBooking.forEach((el) => {
        if (
          dayjs(day).isBetween(el.checkInDate, el.checkOutDate, "day", "[)")
        ) {
          bookedDays[day] = bookedDays[day] + 1 || 1;
        } else {
          bookedDays[day] = bookedDays[day] || 0;
        }
      });
    });
    const room = await this.roomService_.get(roomId);

    return Object.entries(bookedDays)
      .filter(([date, count]) => count >= (room?.quantity || 0))
      .map(([date, count]) => date);
  }

  async getIsBookingValid(roomId: string, startDate: string, endDate: string) {
    if (dayjs(startDate).isBefore(dayjs().subtract(1, "day"))) {
      throw new Error("The check in date and check out date is not valid");
    }
    const disabledDates = await this.getDisabledBookingDate(
      roomId,
      startDate,
      endDate
    );
    return disabledDates.length == 0;
  }

  async getRoomBookingPrice(
    roomId: string,
    checkInDate: string,
    checkOutDate: string
  ) {
    const isBookingValid = await this.getIsBookingValid(
      roomId,
      checkInDate,
      checkOutDate
    );
    if (!isBookingValid) {
      throw new Error("Rooms not available anymore, try to select other date");
    }
    const roomData = await this.roomService_.get(roomId);

    const numberOfNight = dayjs(checkOutDate).diff(checkInDate, "day");

    let totalPrice = 0;
    const customPricing = await this.db_
      .select()
      .from(pricing)
      .where(
        and(
          eq(pricing.roomId, roomId),
          or(gte(pricing.date, checkInDate), isNotNull(pricing.dayOfWeek))
        )
      );

    let start = checkInDate;
    const additionalData = [];
    const weekdays = dayjs().localeData().weekdays();
    while (dayjs(start).isBefore(checkOutDate)) {
      const checkedSameDateIndex = customPricing.findIndex((el) =>
        dayjs(el.date).isSame(start, "d")
      );
      const weekday = weekdays[dayjs(start).day()];
      const checkedSameDayIndex = customPricing.findIndex(
        (el) => el.dayOfWeek === weekday.toLowerCase()
      );

      if (checkedSameDateIndex >= 0) {
        additionalData.push({
          date: start,
          price: customPricing[checkedSameDateIndex]?.price || 0,
        });
        totalPrice += customPricing[checkedSameDateIndex]?.price || 0;
      } else if (checkedSameDayIndex >= 0) {
        additionalData.push({
          date: start,
          price: customPricing[checkedSameDayIndex]?.price || 0,
        });
        totalPrice += customPricing[checkedSameDayIndex]?.price || 0;
      } else {
        totalPrice += roomData.basePrice || 0;
      }
      start = dayjs(start).add(1, "day").format("YYYY-MM-DD");
    }

    const basePrice =
      (numberOfNight - additionalData.length) * roomData.basePrice;
    return {
      room: roomData,
      numberOfNight,
      totalPrice,
      basePrice,
      additionalData,
    };
  }
}
