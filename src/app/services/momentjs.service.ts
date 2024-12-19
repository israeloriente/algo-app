import * as momentjs from "moment-timezone";

class MomentjsService {
  /** Reformats date string into a given format.
   * @param date Date to be reformatted.
   * @param value Format to be used.
   * @returns Formatted date.
   * @bug not used -> see "convert" at the end of file. */
  format(date, value) {
    return momentjs(date).format(value);
  }

  /** Calculates the time difference between two different dates.
   * @param date1 First date.
   * @param date2 Second date.
   * @param type Type of time difference.
   * @returns Time difference. */
  diff(
    date1: Date,
    date2: Date,
    type: "seconds" | "minutes" | "hours" | "days" | "weeks" | "months" | "years"
  ) {
    return momentjs(date1).diff(momentjs(date2), type);
  }

  /** By default, adds one month to an already existing date.
   * @param date Date to add one month to.
   * @param qtd Quantity of months to add.
   * @returns Date with one or more months added. */
  addMonth(date: Date, qtd?: number) {
    return momentjs(date)
      .add(qtd ? qtd : 1, "months")
      .toDate();
  }
  /** By default, subtracts one month to an already existing date.
   * @param date Date to subtract one month to.
   * @param qtd Quantity of months to subtract.
   * @returns Date with one or more months subtracted. */
  subtractMonth(date: Date, qtd?: number) {
    return momentjs(date)
      .subtract(qtd ? qtd : 1, "months")
      .toDate();
  }

  /** Retrieves the last element of a date, based on the type selected.
   * @param date Date to retrieve the element from.
   * @param type Type of element to retrieve.
   * @returns Last element of the date. */
  getEnd(date: any, type: "year" | "month" | "week" | "day" | "hour" | "minute" | "second") {
    return momentjs(date).endOf(type);
  }

  /** Retrieves the first element of a date, based on the type selected.
   * @param date Date to retrieve the element from.
   * @param type Type of element to retrieve.
   * @returns First element of the date. */
  getStart(date: any, type: "year" | "month" | "week" | "day" | "hour" | "minute" | "second") {
    return momentjs(date).startOf(type);
  }

  /** Sorts an array of items based on their creation date, from newest at the top to oldest at the bottom.
   * @param val Array of items to sort.
   * @returns Sorted array. */
  async sortLast(val) {
    let res = await val.sort((a, b) => {
      return momentjs(b.createdAt).diff(a.createdAt);
    });
    return res;
  }

  /** Sorts "Rendimentos" items.
   * @deprecated currently not in use. */
  async sortRendimentos(val) {
    let res = await val.sort((a, b) => {
      return momentjs(b.jobStart).diff(a.jobStart);
    });
    return res;
  }

  /** Calculates the number of hours spent working, based on starting and ending time.
   * @param dayInit Starting time.
   * @param dayEnd Ending time.
   * @returns Difference between dayInit and dayEnd. */
  hoursBetweenDays(dayInit: any, dayEnd: any) {
    var duration = momentjs.duration(momentjs(dayEnd).diff(momentjs(dayInit)));
    return duration.asHours();
  }

  /** Used to set the seconds and milliseconds on date to 0.
   * @param date Date to reset the seconds and milliseconds.
   * @returns Date with seconds and milliseconds set to 0. */
  resetSecondsAndMillisecond(date: Date) {
    var m = momentjs(date);
    m.set({ second: 0, millisecond: 0 });
    return m.toDate();
  }

  /** Returns the first day of the month at the first hour and first minute.
   * @param date Date to retrieve the first day of the month from.
   * @returns First day of the month. */
  getFirstDayOfMonth(date?: Date) {
    return momentjs(date).clone().startOf("month").toDate();
  }

  /** Returns the last day of the month at the last hour and last minute.
   * @param date Date to retrieve the last day of the month from.
   * @returns Last day of the month. */
  getLastDayOfMonth(date?: Date) {
    return momentjs(date).clone().endOf("month").toDate();
  }

  /** Adds hours to a date based on the amount given.
   * @param date Date to add hours to.
   * @param qtd Quantity of hours to add.
   * @returns Date with hours added. */
  addHour(date, qtd) {
    return momentjs(date).add(qtd, "hours");
  }

  // Converter data, retorna moment object
  /** Converts a date to a moment object.
   * @param date Date to convert.
   * @param type Type of format to convert the date to.
   * @returns The date converted to the new format. */
  convert(date: any, type: string) {
    // type ex: "'dd/MM/yyyy'"
    return momentjs(date, type);
  }
}

export const moment = new MomentjsService();
