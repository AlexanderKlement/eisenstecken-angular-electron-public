// TypeScript (src/app/date.ts)
import dayjs from "dayjs/esm";
export const now = () => dayjs();
export const parse = (v: string | number | Date, fmt?: string) =>
  fmt ? dayjs(v, fmt) : dayjs(v);
export const format = (d: dayjs.Dayjs, fmt: string) => d.format(fmt);
export const add = (d: dayjs.Dayjs, n: number, unit: dayjs.ManipulateType) => d.add(n, unit);
export const diff = (a: dayjs.Dayjs, b: dayjs.Dayjs, unit?: dayjs.OpUnitType, float?: boolean) =>
  a.diff(b, unit, float);
export const isValid = (d: dayjs.Dayjs) => d.isValid();
