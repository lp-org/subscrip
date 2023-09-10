"use client";
import FullCalendar from "@fullcalendar/react";
import React from "react";
import dayGridPlugin from "@fullcalendar/daygrid"; // a plugin!

const DashboardPage = () => {
  return (
    <div>
      {" "}
      <FullCalendar plugins={[dayGridPlugin]} initialView="dayGridMonth" />
    </div>
  );
};

export default DashboardPage;
