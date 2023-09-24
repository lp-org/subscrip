import React from "react";
import RoomForm from "../../../../../../components/view/Form/RoomForm";

import { AxiosRequestConfig, axiosClient } from "sdk";
import { useQuery } from "@tanstack/react-query";

import { serverApiRequest } from "../../../../../../utils/server-client-request";
import { revalidatePath } from "next/cache";

// const clientRequest = ({ storeId }: ClientRequest) => {
//   return (method: string, path = "", payload = {}) => {
//     const options: AxiosRequestConfig = {
//       method,
//       withCredentials: true,

//       url: path,
//       data: payload,
//       headers: { storeId, Cookie: cookies().toString() },
//     };
//     options.params = method === "GET" && payload;

//     return request(options);
//   };
// };

async function getData(storeId: string, roomId: string) {
  // The return value is *not* serialized
  // You can return Date, Map, Set, etc.

  const req = serverApiRequest(storeId);
  const data = await req.room.get(roomId);

  // if (!res.ok) {
  //   // This will activate the closest `error.js` Error Boundary
  //   throw new Error("Failed to fetch data");
  // }

  return await data.json();
}
const UpdateRoomPage = async ({ params }) => {
  revalidatePath(`/store/${params.storeId}/rooms/${params.id}`);
  const room = await getData(params.storeId, params.id);

  // const params = useParams();

  // const id: string = params.id;

  // const { data, isLoading } = useQuery({
  //   queryFn: () => adminClient.room.get(id),
  //   queryKey: ["getRoom", id],
  // });

  return <>{room && <RoomForm payload={room} isLoading={false} />}</>;
};

export default UpdateRoomPage;

export const metadata = {
  title: "Edit Room",
};
export const fetchCache = "force-no-store";
