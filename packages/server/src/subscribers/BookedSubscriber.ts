import EventBusService from "../services/EventBusService";

type InjectedDependencies = {
  eventBusService: EventBusService;
};

export default class BookedSubscriber {
  protected readonly eventBusService_;
  constructor({ eventBusService }: InjectedDependencies) {
    this.eventBusService_ = eventBusService;

    this.eventBusService_.subscribe("room.booked", this.handleBookedRoom);
  }

  async handleBookedRoom() {
    throw new Error("sadada");
  }
}
