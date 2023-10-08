"use client"
import React from "react";

import Selection from "./Selection";

const Selections = () => {
  return (
    <section className="container px-4 grid gap-2 sm:grid-cols-3 sm:grid-rows-2">
      <Selection figure="/borabora1.jpg" caption="Bora Bora" />
      <Selection figure="/borabora2.jpg" caption="Cozumel" />
      <Selection figure="/borabora1.jpg" caption="Maldives" />
      <Selection figure="/maldives2.jpg" caption="Jamaica" />
      <Selection figure="/maldives3.jpg" caption="Antigua" />
      <Selection figure="/keywest.jpg" caption="Key West" />
    </section>
  );
};

export default Selections;
