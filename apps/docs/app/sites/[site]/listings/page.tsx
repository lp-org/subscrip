import React from "react";
import HotelCard from "../../../../components/frontstore/HotelCard";

import { serverApiRequest } from "../../../../utils/server-client-request";

async function getData(params: any) {
  const req = serverApiRequest(params.site);
  const data = await req.room.list({});

  const rooms = data.data.room;
  return rooms;
}
const Listings = async ({ params }) => {
  const rooms = await getData(params);
  return (
    <div className="mx-auto max-w-screen-lg p-4">
      <div className="grid grid-cols-1 gap-4">
        {rooms.map((room, index) => (
          <HotelCard key={index} data={room} />
        ))}
      </div>
    </div>
  );
};

export default Listings;

export const metadata = {
  title: `Listing`,
};
