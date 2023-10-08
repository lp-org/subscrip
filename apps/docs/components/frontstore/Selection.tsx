import Image from "next/image";
import React from "react";
import BackendImage from "../BackendImage";

const Selection = ({ figure, caption }) => {
  return (
    <figure className="relative">
      <BackendImage
        width={50}
        height={50}
        src={figure}
        alt={caption}
        className="h-full w-full object-cover"
      />
      <figcaption className="absolute bottom-2 left-2 z-5 text-2xl font-bold text-white">
        {caption}
      </figcaption>
      <div className="absolute left-0 top-0 h-full w-full bg-black/30"></div>
    </figure>
  );
};

export default Selection;
