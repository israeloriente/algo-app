import { Component } from "@angular/core";
import * as moment from "moment";

@Component({
  selector: "app-timer",
  templateUrl: "./stop-watch.component.html",
  styleUrls: ["./stop-watch.component.scss"],
})
export class StopWatchComponent {
  duration: moment.Moment = moment("00:00:00", "HH:mm:ss");
  currentTime: moment.Moment = moment("00:00:00", "HH:mm:ss");
  timer: any = null;
  timerDisplay: string = "00:00:00";

  ngOnDestroy(): void {
    this.stopCount();
  }

  init(start: Date, end: Date, isRunning: boolean): void {
    if (start) {
      const duration = moment(start);
      const endTime = end == undefined ? moment() : moment(end);
      const diffMilliseconds = endTime.diff(duration);
      const diffTime = moment.utc(diffMilliseconds);
      const formattedDiff = diffTime.format("HH:mm:ss");
      if (isRunning) {
        this.timeCount(formattedDiff);
      } else {
        this.duration = moment(start);
        this.currentTime = moment(end);
        this.timerDisplay = moment.utc(this.currentTime.diff(this.duration)).format("HH:mm:ss");
      }
    }
  }

  timeCount(startInput: string): void {
    if (this.timerDisplay !== "00:00:00") {
      this.duration = moment(this.timerDisplay, "HH:mm:ss");
    } else {
      this.duration = moment(startInput, "HH:mm:ss");
    }
    this.timer = setInterval(() => this.countUp(), 1000);
    this.timerDisplay = this.duration.format("HH:mm:ss");
  }

  countUp(): void {
    this.duration.add(1, "second");
    this.timerDisplay = this.duration.format("HH:mm:ss");
  }

  stopCount(): void {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }
}
