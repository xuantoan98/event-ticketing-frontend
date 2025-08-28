import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

export function toUTC(date) {
  return dayjs(date).utc().toDate();
}

export function toLocal(date, format = "YYYY-MM-DD HH:mm") {
  return dayjs.utc(date).local().format(format);
}

export function formatDateTime(date, format = "YYYY-MM-DD HH:mm", isUTC = false) {
  return isUTC ? dayjs.utc(date).format(format) : dayjs(date).format(format);
}

export function formatDate(date, format = "YYYY-MM-DD", isUTC = false) {
  return isUTC ? dayjs.utc(date).format(format) : dayjs(date).format(format);
}

export function nowUTC() {
  return dayjs().utc().toISOString();
}
