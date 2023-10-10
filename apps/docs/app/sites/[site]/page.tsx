"use client";
import Destinations from "../../../components/frontstore/Destinations";
import Hero from "../../../components/frontstore/Hero";
import Search from "../../../components/frontstore/Search";

export default function Home() {
  return (
    <>
      <Hero />

      {/* <Destinations slider={setting.slider} /> */}
      <div className="container text-center">
        <h2 className="text-2xl font-bold">
          Escape to Paradise with Our Expertly Curated Holiday Collections
        </h2>
        <div className="mt-2">
          An exciting family resort that’s located at the gateway to the
          historical town of Malacca. Be pampered and thrilled by our luxurious
          accommodation and fascinating tourist sites!
        </div>
      </div>
      {/* <Search /> */}
    </>
  );
}
