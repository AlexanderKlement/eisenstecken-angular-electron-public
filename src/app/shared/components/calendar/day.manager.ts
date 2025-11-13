import dayjs from "dayjs/esm";

export class DayManager {
  startDay: number;
  amountOfDays: number;
  amountOfDaysString: string;
  shownDayArray: number[];

  constructor(
    startDay: number,
    defaultAmountOfDays: number,
    startOnMonday: boolean = false,
  ) {
    if (startOnMonday) {
      this.startDay = this.getMondayDifference(); // This could be extended, but it serves its purpose now
    } else {
      this.startDay = startDay;
    }
    this.amountOfDays = defaultAmountOfDays;
    this.refreshAllDayVariables();
  }

  getStartDate(): string {
    return dayjs().add(this.startDay, "days").format("DD-MM");
  }

  getEndDate(): string {
    return dayjs()
      .add(this.startDay + this.amountOfDays, "days")
      .format("DoMM");
  }

  getShownDayArray(): number[] {
    return this.shownDayArray;
  }

  setStartDay(startDay: number): void {
    this.startDay = startDay;
    this.refreshAllDayVariables();
  }

  setAmountOfDays(amountOfDays: number): void {
    this.amountOfDays = amountOfDays;
    this.refreshAllDayVariables();
  }

  moveStartDayRight(): void {
    this.startDay += this.amountOfDays;
    this.refreshAllDayVariables();
  }

  moveStartDayLeft(): void {
    this.startDay -= this.amountOfDays;
    this.refreshAllDayVariables();
  }

  private refreshAllDayVariables(): void {
    this.amountOfDaysString = this.amountOfDays.toString();
    this.shownDayArray = Array.from(
      { length: this.amountOfDays },
      (_, i) => i + this.startDay,
    );
  }

  private getMondayDifference(): number {
    const currentDayId = dayjs().day();
    switch (currentDayId) {
      case 0:
        return -6;
      default:
        return 1 - currentDayId;
    }
  }
}
