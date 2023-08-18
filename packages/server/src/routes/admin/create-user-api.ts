import { POST, route } from "awilix-express";

@route("/create-user")
export default class CreateUserApi {
  @route("/signup")
  @POST()
  async createUser() {}
}
