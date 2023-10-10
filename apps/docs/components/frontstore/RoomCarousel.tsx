/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useEffect } from "react";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/counter.css";
import Counter from "yet-another-react-lightbox/plugins/counter";
import { Splide, SplideSlide } from "@splidejs/react-splide";
import "@splidejs/react-splide/css";

import { Gallery } from "db";
import Image from "next/image";
import { Button } from "@radix-ui/themes";
import { useMobileView } from "ui";

const RoomCarousel = ({ images }: { images: Gallery[] }) => {
  const [open, setOpen] = React.useState(false);
  // Add empty strings to the array if its length is less than 10
  // const paddedImages =
  //   images.length < 5
  //     ? [...images].concat(new Array(0).map(() => ""))
  //     : images.slice(0, 5);
  const mainRef = React.createRef<Splide>();
  const thumbsRef = React.createRef<Splide>();
  useEffect(() => {
    if (mainRef.current && thumbsRef.current && thumbsRef.current.splide) {
      mainRef.current.sync(thumbsRef.current.splide);
    }
  }, []);
  const isMobileView = useMobileView();
  // const width = useCurrentWidth();
  return (
    <>
      {/* <div className="relative grid h-72 grid-cols-4 grid-rows-2 gap-2">
        <div className="col-span-4 row-span-2 lg:col-span-2">
          {images[0] && (
            <BackendImage
              src={images[0]}
              width={1200}
              height={900}
              alt="first image"
              className="h-full rounded-b-lg object-cover lg:h-72 lg:rounded-lg"
            />
          )}
        </div>
        {paddedImages.map((image, i) => {
          if (i > 0) {
            return (
              <div className="col-span-1 row-span-1 hidden lg:block" key={i}>
                <BackendImage
                  src={image}
                  width={1200}
                  height={900}
                  alt={"image" + i}
                  className="h-full rounded-lg object-cover"
                />
              </div>
            );
          }
        })}
        <Button
          type="button"
          variant="secondary"
          onClick={() => setOpen(true)}
          className="absolute bottom-0 right-0 m-2 bg-black text-white opacity-75 hover:bg-black hover:opacity-100"
        >
          View all
        </Button>
      </div> */}
      <div className="relative">
        <Splide
          aria-label="Gallery"
          ref={mainRef}
          options={{
            type: "fade",
            pagination: false,
            arrows: false,
          }}
        >
          {images.map((el, i) => (
            <SplideSlide key={i}>
              <Image
                src={el.url}
                width={1200}
                height={800}
                alt="banner"
                className="h-[400px] object-cover lg:h-[550px]"
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
          {images.map((el, i) => (
            <SplideSlide key={i} className=" hover:cursor-pointer">
              <Image
                src={el.url}
                width={1200}
                height={800}
                alt="banner"
                className="rounded-lg object-cover"
              />
            </SplideSlide>
          ))}
        </Splide>
        <Button
          type="button"
          variant="surface"
          onClick={() => setOpen(true)}
          className="absolute right-0 top-0 m-2 bg-black text-white opacity-75 hover:bg-black hover:opacity-100"
        >
          View all
        </Button>
      </div>
      <Lightbox
        plugins={[Counter]}
        counter={{ container: { style: { top: "unset", bottom: 0 } } }}
        open={open}
        close={() => setOpen(false)}
        slides={images.map((image) => ({
          src: image.url,
          imageFit: "cover",
          height: isMobileView ? 300 : 640,
          width: 960,
        }))}
      />
    </>
  );
};

export default RoomCarousel;
