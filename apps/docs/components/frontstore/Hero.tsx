import React from "react";

import Link from "next/link";
import { Button } from "@radix-ui/themes";

const Hero = () => {
  return (
    <header className="relative h-screen w-full bg-cover bg-no-repeat">
      <video
        src="/_assets/beachVid.mp4"
        className="h-full w-full object-cover"
        style={{ objectFit: "cover" }}
        autoPlay
        loop
        muted
      />

      <div
        className="absolute top-0 h-screen w-full bg-cover bg-no-repeat"
        style={{
          backgroundImage:
            "radial-gradient( closest-side at 50% 50%, rgba(255, 255, 255, 0), #000 130% )",
        }}
      ></div>
      <div className="absolute left-0 top-0 h-full w-full bg-gray-900/30"></div>
      <div className="absolute left-0 top-0 flex h-full w-full flex-col justify-center text-center">
        <h1 className="mb-2 text-white">First Class Travel</h1>
        <h2 className="mb-4 text-white">Top 1% Locations Worldwide</h2>
        <Link href="/listings">
          <Button className="w-40 text-center text-white">See More</Button>
        </Link>
      </div>
    </header>
  );
};

export default Hero;
