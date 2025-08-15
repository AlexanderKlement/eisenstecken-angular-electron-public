import * as  moment from "moment";

interface Days {
    value: string;
    viewValue: string;
}

export class DayManager {

    startDay: number;
    amountOfDays: number;
    amountOfDaysString: string;
    shownDayArray: number[];

    constructor(startDay: number, defaultAmountOfDays: number, startOnMonday: boolean = false) {
        if (startOnMonday) {
            this.startDay = this.getMondayDifference(); // This could be extended, but it serves its purpose now
        } else {
            this.startDay = startDay;
        }
        this.amountOfDays = defaultAmountOfDays;
        this.refreshAllDayVariables();
    }

    getStartDate(): string {
        return moment().add(this.startDay, "days").format("DoMM");
    }

    getEndDate(): string {
        return moment().add(this.startDay + this.amountOfDays, "days").format("DoMM");
    }

    getShownDayArray(): number[] {
        return this.shownDayArray;
    }

    getAmountOfDaysString(): string {
        return this.amountOfDaysString;
    }

    getStartDay(): number {
        return this.startDay;
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
        this.shownDayArray = Array.from({length: this.amountOfDays}, (_, i) => i + this.startDay);
    }

    private getMondayDifference(): number {
        const currentDayId = moment().day();
        switch (currentDayId) {
            case 0:
                return -6;
            default:
                return (1 - currentDayId);
        }
    }
}
