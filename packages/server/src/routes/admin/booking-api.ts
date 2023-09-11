import { POST, route } from "awilix-express";
import { Request, Response } from "express";
import BookingService from "../../services/BookingService";

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
  async get(req: Request, res: Response) {}

  @route("/")
  @POST()
  async createBooking(req: Request, res: Response) {
    this.bookingService_.create(req.body);
  }
}
