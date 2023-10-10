// import { AmenitiesIcon } from "@/lib/AmenitiesIcon";

import { ScrollArea, Separator } from "@radix-ui/themes";
import dayjs from "dayjs";
import { AirVent, Users } from "lucide-react";
import { Metadata } from "next";
import React from "react";
import ReactMarkdown from "react-markdown";
import { serverApiRequest } from "../../../../../utils/server-client-request";
import CustomerBookingForm from "../../../../../components/forms/CustomerBookingForm";
import RoomNotFound from "../../../../../components/404/NotFound";
import RoomCarousel from "../../../../../components/frontstore/RoomCarousel";

async function getData(params: any) {
  const req = serverApiRequest(params.site);
  const data = await req.room.get(params.id);

  const rooms = data?.data;
  return rooms;
}
const RoomListing = async ({ params }) => {
  const data = await getData(params);
  if (!data) return <RoomNotFound title="Room Not Found" />;
  // const currentMonthDisabledDays = await getDisabledBookingDate(
  //   +id,
  //   dayjs().format("YYYY-MM-DD"),
  //   dayjs().add(1, "month").startOf("month").format("YYYY-MM-DD")
  // );
  return (
    <div className="mx-auto max-w-screen-lg lg:mt-8">
      <RoomCarousel images={data.images || []} />

      <div className="m-4">
        <h2 className="mb-4 text-3xl font-bold tracking-tight">{data.name}</h2>

        {!!data.maximumOccupancy && (
          <div className="flex flex-col">
            <div className="flex flex-row">
              <Users /> {data.maximumOccupancy}
            </div>
            <span>Maximum Occupancy</span>
          </div>
        )}

        <Separator className="my-4" />
        <div className="grid grid-cols-1 gap-y-4 lg:grid-cols-3 lg:gap-4">
          <div className="order-last col-span-2 lg:order-first">
            <div>
              <ScrollArea className="h-full">
                <div
                  dangerouslySetInnerHTML={{ __html: data.description || "" }}
                ></div>
              </ScrollArea>
            </div>
            {!!Object.values(data.amenities || {}).filter((el) => el === true)
              .length && (
              <>
                <h2 className="mb-4 text-xl font-bold tracking-tight ">
                  Amenities
                </h2>
                {/* <div>
                  <AmenitiesIcon amenities={data.amenities} />
                </div> */}
              </>
            )}
          </div>
          <CustomerBookingForm
            data={data}
            // currentMonthDisabledDays={currentMonthDisabledDays}
          />
        </div>
      </div>
    </div>
  );
};

export default RoomListing;

export async function generateMetadata({ params }): Promise<Metadata> {
  const data = await getData(params);
  return { title: data?.name };
}
