// TypeScript (e.g., src/app/dayjs-setup.ts)
import dayjs from "dayjs/esm";
import "dayjs/esm/locale/de";
import utc from "dayjs/esm/plugin/utc";
import timezone from "dayjs/esm/plugin/timezone";
import localizedFormat from "dayjs/esm/plugin/localizedFormat";
import relativeTime from "dayjs/esm/plugin/relativeTime";
import customParseFormat from "dayjs/esm/plugin/customParseFormat";
import isoWeek from "dayjs/esm/plugin/isoWeek";
import duration from "dayjs/esm/plugin/duration";

dayjs.extend(duration);
dayjs.extend(isoWeek);
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(localizedFormat);
dayjs.extend(relativeTime);
dayjs.extend(customParseFormat);

dayjs.locale("de");

export default dayjs;
