import dayjs from "dayjs";
import isBetweenPlugin from "dayjs/plugin/isBetween";
dayjs.extend(isBetweenPlugin);
export function formatDate(payload?: Date | string | null) {
  return payload ? dayjs(payload).format("DD MMM YYYY") : "-";
}

export function formatDateTime(payload?: Date | string | null) {
  return payload ? dayjs(payload).format("DD MMM YYYY HH:mm:ss") : "-";
}

export function formatDateRange(
  startDate?: Date | string | null,
  endDate?: Date | string | null
) {
  const sd = startDate ? dayjs(startDate).format("DD MMM YYYY") : "-";
  const ed = endDate ? dayjs(endDate).format("DD MMM YYYY") : "";
  return ed ? sd + ` - ${ed}` : sd;
}

export function isBetween(
  date: string | number | Date | dayjs.Dayjs | null | undefined,
  startAt: string | number | Date | dayjs.Dayjs | null | undefined,
  endAt: string | number | Date | dayjs.Dayjs | null | undefined
) {
  return dayjs(date).isBetween(startAt, endAt, "day", "[)");
}
