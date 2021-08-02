import { format, fromUnixTime, millisecondsToSeconds } from "date-fns";

const STANDARD_FORMAT = "dd MMM yy, kk:mm";

export const unixToDate = (unix: string) => {
  const unixNum = parseInt(unix);

  // convert from ms to s
  const inSeconds = millisecondsToSeconds(unixNum);

  // covert unix in s to date
  const date: Date = fromUnixTime(inSeconds);

  // format
  return format(date, STANDARD_FORMAT);
};
