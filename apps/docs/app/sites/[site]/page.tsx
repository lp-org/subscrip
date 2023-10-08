"use client";
import Destinations from "../../../components/frontstore/Destinations";
import Hero from "../../../components/frontstore/Hero";
import Search from "../../../components/frontstore/Search";

export default function Home() {
  const setting = {
    id: 1,
    name: "a",
    email: "mmmz",
    logo: null,
    favicon: null,
    ogimage: null,
    phone: "012312312",
    address: "12, Old Town, East Side of Koh Lanta. Krabi Province, Thailand",
    facebook: "https://facebook.com/facebook",
    instagram: "https://facebook.com/facebook",
    currency: null,
    slider: [
      {
        url: "jhgkgk",
        image: "/uploads/borabora2.jpg-pQUTA.jpeg",
        is_active: true,
        open_new: true,
      },
      {
        url: "",
        image: "/uploads/borabora1.jpg-BwCoU.jpeg",
        is_active: true,
        open_new: true,
      },
    ],
    createdAt: "2023-06-12T16:45:26.709Z",
    updatedAt: "2023-06-12T16:45:26.709Z",
  };
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
