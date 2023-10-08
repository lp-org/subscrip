import React from "react";
import RoomForm from "../../../../../../components/view/Form/RoomForm";

import { AxiosRequestConfig, axiosClient } from "sdk";
import { useQuery } from "@tanstack/react-query";

import { serverApiRequest } from "../../../../../../utils/server-client-request";
import { revalidatePath } from "next/cache";

async function getData(storeId: string, roomId: string) {
  // The return value is *not* serialized
  // You can return Date, Map, Set, etc.

  const req = serverApiRequest(storeId);
  const data = await req.room.get(roomId);

  return data?.data;
}
const UpdateRoomPage = async ({ params }) => {
  revalidatePath(`/store/${params.storeId}/rooms/${params.id}`);
  const room = await getData(params.storeId, params.id);

  return <>{room && <RoomForm payload={room} isLoading={false} />}</>;
};

export default UpdateRoomPage;

export const metadata = {
  title: "Edit Room",
};
export const fetchCache = "force-no-store";
