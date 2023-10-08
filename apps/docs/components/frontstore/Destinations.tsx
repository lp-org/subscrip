"use client";

import React, { useEffect } from "react";
import BackendImage from "../BackendImage";

import { Splide, SplideSlide } from "@splidejs/react-splide";
import { SliderType } from "@/types/shared";
import "@splidejs/react-splide/css";
import { useRouter } from "next/navigation";
const Destinations = ({ slider }: { slider?: SliderType[] | null }) => {
  const sliders = slider?.filter((el) => el.is_active) || [];
  const mainRef = React.createRef<Splide>();
  const thumbsRef = React.createRef<Splide>();
  useEffect(() => {
    if (mainRef.current && thumbsRef.current && thumbsRef.current.splide) {
      mainRef.current.sync(thumbsRef.current.splide);
    }
  }, []);
  const router = useRouter();
  return (
    <section className="container my-16 flex flex-col items-center px-4">
      <h2 className="mb-4 text-3xl font-bold">Gallery</h2>
      <p className="mb-8 font-bold">{`On the Caribbean's Best Beaches`}</p>

      <Splide
        aria-label="Gallery"
        ref={mainRef}
        options={{
          type: "fade",
          pagination: false,
          arrows: false,
          autoplay: true,
        }}
      >
        {sliders.map((el, i) => (
          <SplideSlide
            key={i}
            onClick={() => {
              if (el.url) {
                if (!el.open_new) router.push(el.url);
                else window.open(el.url, "_blank");
              }
            }}
            className=" hover:cursor-pointer"
          >
            <BackendImage
              src={el.image}
              width={1200}
              height={800}
              alt="banner"
              className="rounded-t-lg object-cover"
            />
          </SplideSlide>
        ))}
      </Splide>

      <Splide
        aria-label="Gallery"
        options={{
          rewind: true,
          fixedWidth: 104,
          fixedHeight: 58,
          isNavigation: true,
          gap: 10,
          focus: "center",
          pagination: false,
          cover: true,
          dragMinThreshold: {
            mouse: 4,
            touch: 10,
          },
          breakpoints: {
            640: {
              fixedWidth: 66,
              fixedHeight: 38,
            },
          },
        }}
        ref={thumbsRef}
        className="flex w-full justify-center rounded-b-lg border p-4"
      >
        {sliders.map((el, i) => (
          <SplideSlide key={i} className=" hover:cursor-pointer">
            <BackendImage
              src={el.image}
              width={1200}
              height={800}
              alt="banner"
              className="rounded-lg object-cover"
            />
          </SplideSlide>
        ))}
      </Splide>
    </section>
  );
};

export default Destinations;
