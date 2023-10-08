import { getFeatureRooms } from "@/server/rooms";
import Image from "next/image";
import React from "react";
import BackendImage from "../BackendImage";
import Link from "next/link";
import { Button } from "../ui/button";
import { ChevronsDown } from "lucide-react";

const Search = async () => {
  const data = await getFeatureRooms();
  return (
    <section className="container my-16  px-4">
      <div className="md:col-span-2">
        <h3 className="mb-4 text-3xl font-bold">Rooms and Suites</h3>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          {data.map((el) => (
            <div
              className="rounded-lg border shadow hover:cursor-pointer"
              key={el.id}
            >
              <Link href={`/listings/${el.id}`}>
                <BackendImage
                  src={el.images?.[0]}
                  width={400}
                  height={200}
                  alt={el.name}
                  className="h-56 rounded-t-lg object-cover"
                />
                <div className=" flex h-52 flex-col  p-4">
                  <h2 className="font-bold">{el.name}</h2>
                  <div className="line-clamp-4  overflow-ellipsis">
                    {el.shortDescription}
                  </div>
                  <div className="mt-auto inline-flex items-center text-blue-500 md:mb-2 lg:mb-0">
                    Book Now
                    <svg
                      className="ml-2 h-4 w-4"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M5 12h14"></path>
                      <path d="M12 5l7 7-7 7"></path>
                    </svg>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
        <div className="m-4 text-center">
          {" "}
          <Link href={`/listings`}>
            <Button variant={"outline"} size={"lg"}>
              See more rooms <ChevronsDown className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Search;
