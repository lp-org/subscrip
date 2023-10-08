"use client";
import React, { useState } from "react";
import Image from "next/image";

const CAROUSEL_DATA = [
  {
    url: "/maldives1.jpg",
  },
  {
    url: "/maldives2.jpg",
  },
  {
    url: "/maldives3.jpg",
  },
];

const Carousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const incrementIndex = () => {
    setCurrentIndex((currentIndex) => {
      return (currentIndex + 1) % CAROUSEL_DATA.length;
    });
  };
  const decrementIndex = () => {
    setCurrentIndex((currentIndex) => {
      return currentIndex === 0 ? CAROUSEL_DATA.length - 1 : currentIndex - 1;
    });
  };
  return (
    <section className="container relative my-12 px-4">
      <Image
        src={CAROUSEL_DATA[currentIndex].url}
        className="mx-auto rounded-md"
        alt="resort image 1"
        width={1200}
        height={1000}
      />
      <div>
        <div
          onClick={decrementIndex}
          className="absolute left-8 top-1/2 -translate-y-1/2 cursor-pointer rounded bg-white p-1"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="h-6 w-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 19.5L8.25 12l7.5-7.5"
            />
          </svg>
        </div>

        <div
          onClick={incrementIndex}
          className="absolute right-8 top-1/2 -translate-y-1/2 cursor-pointer rounded bg-white p-1"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="h-6 w-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8.25 4.5l7.5 7.5-7.5 7.5"
            />
          </svg>
        </div>
      </div>
    </section>
  );
};

export default Carousel;
