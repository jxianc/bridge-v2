import { format, fromUnixTime } from "date-fns";

const STANDARD_FORMAT = "do LLL yyyy, kk:mm";

export const unixToDate = (unix: string) => {
  const date: Date = fromUnixTime(Number(unix));
  return format(date, STANDARD_FORMAT);
};
