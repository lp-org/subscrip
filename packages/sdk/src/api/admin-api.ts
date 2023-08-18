import medusaRequest from "../client";

const AdminApi = {
  user: {
    get() {
      return medusaRequest("GET", "/users/1");
    },
  },
};

export default AdminApi;
