import EventBusService from "../services/EventBusService";

type InjectedDependencies = {
  eventBusService: EventBusService;
};

export default class OrderedSubscriber {
  protected readonly eventBusService_;
  constructor({ eventBusService }: InjectedDependencies) {
    this.eventBusService_ = eventBusService;
    this.eventBusService_.subscribe("room.ordered", this.handleOrderedRoom);
  }

  async handleOrderedRoom() {
    throw new Error("sadada");
  }
}
