import dayjs from "dayjs";

export function formatDate(payload?: Date | string | null) {
  return payload ? dayjs(payload).format("DD MMM YYYY") : "-";
}

export function formatDateTime(payload?: Date | string | null) {
  return payload ? dayjs(payload).format("DD MMM YYYY HH:mm:ss") : "-";
}
