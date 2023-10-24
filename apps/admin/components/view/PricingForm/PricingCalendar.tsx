"use client";
import { DatesSetArg } from "@fullcalendar/core";
import FullCalendar from "@fullcalendar/react";
import React, { useMemo, useState } from "react";
import dayGridPlugin from "@fullcalendar/daygrid"; // a plugin!
import dayjs from "dayjs";
import { formatPrice, isBetween } from "ui";
import { useStoreCurrency } from "../../../utils/use-store-currency";
import { Pricing, PricingRule } from "db";
import { DAY_Of_WEEk } from "utils-data";

function getFinalAmountPrice(rule: PricingRule, basePrice: number) {
  if (rule.type === "amount") {
    return rule.value;
  } else if (rule.type === "fixed") {
    return rule.value + basePrice;
  } else if (rule.type === "percentage") {
    return basePrice * (rule.value / 100 + 1);
  }
}

function isOnWeekday(
  date: string | number | Date | dayjs.Dayjs | null | undefined,
  dayOfWeeks: string[]
) {
  if (!dayOfWeeks.length) return true;
  const d = dayjs(date).day();
  const dayOfWeek = DAY_Of_WEEk[d];
  return dayOfWeeks.includes(dayOfWeek);
}

const PricingCalendar = ({ pricing }: { pricing: Pricing }) => {
  const [dateSets, setDateSets] = useState<DatesSetArg>();

  const currency = useStoreCurrency();
  const events = useMemo(() => {
    const temp = [];
    let tempDate = dateSets?.start;

    while (dayjs(tempDate).isBefore(dateSets?.end)) {
      let basePrice = pricing?.basePrice;

      pricing?.pricingRule?.forEach((e) => {
        if (
          e.startAt &&
          e.endAt &&
          isBetween(tempDate, e.startAt, e.endAt) &&
          isOnWeekday(tempDate, e.dayOfWeek)
        ) {
          basePrice = getFinalAmountPrice(e, basePrice) || 0;
        } else if (
          e.startAt &&
          !e.endAt &&
          dayjs(tempDate).isAfter(e.startAt) &&
          isOnWeekday(tempDate, e.dayOfWeek)
        ) {
          basePrice = getFinalAmountPrice(e, basePrice) || 0;
        }
      });

      temp.push({
        title: formatPrice(basePrice),
        date: dayjs(tempDate).format("YYYY-MM-DD"),
        backgroundColor: "transparent",
        color: "black",
        textColor: "black",
        borderColor: "transparent",
        className: "text-xs text-right",
      });
      tempDate = dayjs(tempDate).add(1, "d").toDate();
    }
    return temp;
  }, [dateSets, pricing]);
  return (
    <div className="flex justify-content-center w-full h-30rem">
      <div className="w-30rem text-sm">
        <FullCalendar
          initialView="dayGridMonth"
          plugins={[dayGridPlugin]}
          datesSet={setDateSets}
          //   events={[
          //     {
          //       title: "200",
          //       date: "2023-10-18",
          //       backgroundColor: "transparent",
          //       color: "black",
          //       textColor: "black",
          //       borderColor: "transparent",
          //       className: "text-xs",
          //     },
          //   ]}
          events={events}
        />
      </div>
    </div>
  );
};

export default PricingCalendar;
