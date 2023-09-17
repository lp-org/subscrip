import { GET, POST, route } from "awilix-express";
import { Request, Response } from "express";
import BookingService from "../../services/BookingService";
import { disabledBookingDate } from "utils-data";

type InjectedDependencies = {
  bookingService: BookingService;
};

@route("/booking")
export default class BookingApi {
  protected readonly bookingService_: BookingService;
  constructor({ bookingService }: InjectedDependencies) {
    this.bookingService_ = bookingService;
  }

  @route("/")
  @GET()
  async get(req: Request, res: Response) {
    const data = await this.bookingService_.list(req.body);
    res.json(data);
  }

  @route("/")
  @POST()
  async createBooking(req: Request, res: Response) {
    const data = await this.bookingService_.create(req.body);
    res.json(data);
  }

  @route("/disabledDates")
  @POST()
  async getDisabledDates(req: Request, res: Response) {
    const validated = disabledBookingDate.parse(req.body);
    const data = await this.bookingService_.getDisabledBookingDate(
      validated.roomId,
      validated.startDate,
      validated.endDate
    );
    res.json(data);
  }

  @route("/bookingPrice")
  @POST()
  async getBookingPrice(req: Request, res: Response) {
    const validated = disabledBookingDate.parse(req.body);
    const data = await this.bookingService_.getRoomBookingPrice(
      validated.roomId,
      validated.startDate,
      validated.endDate
    );
    res.json(data);
  }
}
