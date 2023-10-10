"use client";
import Image from "next/image";
import React from "react";
import Link from "next/link";

import { Users } from "lucide-react";

import { formatPrice } from "../../../../packages/ui";
import { Button } from "@radix-ui/themes";
import { Room } from "db";
const HotelCard = ({ data }: { data: Room }) => {
  return (
    <div>
      <div className="w-full rounded-lg border border-gray-200 bg-white shadow">
        <div className="grid grid-cols-3">
          <Link
            href={`/listings/${data.id}`}
            className="col-span-3 lg:col-span-1"
          >
            <Image
              width={1200}
              height={900}
              className=" h-56 w-full rounded-t-lg object-cover p-0 lg:p-4"
              src={data.images[0]?.url || "/_assets/placeholder.png"}
              alt="product image"
            />
          </Link>
          <div className="col-span-3 flex flex-col px-5 py-4 lg:col-span-2">
            <h5 className="truncate text-ellipsis  text-xl font-semibold tracking-tight text-gray-900">
              {data.name}
            </h5>
            {!!data.maximumOccupancy && (
              <div className="mt-4 flex flex-col text-sm">
                <div className="flex flex-row">
                  <Users className="h-4 w-4 lg:h-6 lg:w-6" />{" "}
                  <span className="ml-2 font-bold  lg:text-xl">
                    {data.maximumOccupancy}
                  </span>
                </div>
                <span>Maximum Occupancy</span>
              </div>
            )}

            <div className=" mt-auto flex items-end justify-between">
              <div>
                <span className="text-xs lg:text-sm">Price from </span>
                <span className="font-bold text-gray-900 lg:text-xl">
                  {formatPrice(data.basePrice, "MYR")}
                </span>
              </div>

              <Link href={`/listings/${data.id}`}>
                <Button>Book Now</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HotelCard;
