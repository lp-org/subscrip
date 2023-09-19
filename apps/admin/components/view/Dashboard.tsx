"use client";
import FullCalendar from "@fullcalendar/react";
import React, { useEffect, useState } from "react";
import dayGridPlugin from "@fullcalendar/daygrid"; // a plugin!
import { Card } from "primereact/card";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useRequest } from "../../utils/adminClient";
import interactionPlugin from "@fullcalendar/interaction"; // needed for dayClick
import { DatesSetArg } from "@fullcalendar/core";
import dayjs from "dayjs";
const DashboardPage = () => {
  const { adminClient } = useRequest();
  const { mutate, data } = useMutation({
    mutationFn: adminClient.booking.getBookingCalendar,
  });
  const [dateSets, setDateSets] = useState<DatesSetArg>();
  useEffect(() => {
    if (dateSets) {
      mutate({
        startDate: dateSets?.startStr,
        endDate: dateSets?.endStr,
      });
    }
  }, [dateSets, mutate]);
  const eventsData = data?.data;
  return (
    <Card title="Calendar">
      <FullCalendar
        dayMaxEventRows
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        datesSet={setDateSets}
        views={{
          timeGrid: {
            dayMaxEventRows: 3,
          },
        }}
        events={eventsData?.map((el) => ({
          title: el.roomName,
          start: dayjs(el.checkInDate).format("YYYY-MM-DD"),
          end: dayjs(el.checkOutDate).format("YYYY-MM-DD"),
        }))}
      />
    </Card>
  );
};

export default DashboardPage;
