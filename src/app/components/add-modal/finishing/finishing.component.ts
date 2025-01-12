import { ChangeDetectorRef, Component, ViewChild } from "@angular/core";
import { ModalController } from "@ionic/angular";
import { Alert } from "@src/app/class/core/Alert";
import { OnValidation, Service } from "src/app/class/services/Service";
import { DeviceService } from "src/app/services/device.service";
import { Events } from "src/app/services/events";
import { GlobalService } from "src/app/services/global.service";
import { Report } from "src/app/class/Report";
import { InjectableService } from "@src/app/decorators/InjectableService";
import { moment } from "@src/app/services/momentjs.service";
import { StopWatchComponent } from "../stop-watch/stop-watch.component";

/** As of 3.7+, this component is only used in the "Movimentos" part of the app.
 * This component is inside AddPlateModalPage. Its purpose is to register the
 * distance travelled and identify the operator.
 *  */
@Component({
  selector: "input-finishing",
  templateUrl: "./finishing.component.html",
  styleUrls: ["./finishing.component.scss"],
})
export class FinishingComponent implements OnValidation {
  @ViewChild(StopWatchComponent) timerComponent!: StopWatchComponent;

  /** Information relative to the car's distance travelled.
   *
   * Changes here are updated at father component in "add-plate-modal". */

  service: Service;
  is_send: boolean = false;

  constructor(
    public controller: InjectableService,
    public device: DeviceService,
    public ev: Events,
    public global: GlobalService,
    private modal: ModalController,
    private cdr: ChangeDetectorRef
  ) {
    this.service = controller?.service;

    this.controller.updateProperty("Description", "Chef", "Photo", FinishingComponent.name);
    if (this.controller.pageStatus == 0 && this.service.ended == undefined) {
      this.controller.updateProperty("ended");
      this.service.ended = new Date();
    }

    console.log("FinishingComponent: ", this.service);
  }

  ngAfterViewInit() {
    if (this.timerComponent) {
      this.timerComponent.init(this.service.StartDate, this.service.EndDate, this.service.StartDate && !this.service.EndDate);
      this.cdr.detectChanges();
    }
  }

  public startService() {
    this.service.StartDate = new Date();
    this.controller.updateProperty("startDate");
    this.controller.save();
    this.timerComponent.init(this.service.StartDate, this.service.EndDate, true);
  }

  endService() {
    let time = moment.diff(new Date(), this.service.StartDate, "minutes");
    if (time >= 1 && this.isMov) {
      if (this.service.EndDate)
        Alert.confirmAlert("global.confirmAlert.finishServiceSaveEndDate").then((confirmed) => {
          if (confirmed) this.finalizeService();
          else this.finishServiceWithoutSaving();
        });
      else this.finalizeService();
    } else if (!this.isMov) {
      this.finishServiceWithoutSaving();
    } else Alert.simpleAlert("global.simpleAlert.tooShortTime");
  }

  finalizeService() {
    this.service.EndDate = new Date();
    this.is_send = true;
    this.service.Status = 0;
    this.controller
      .save()
      .then((res) => {
        this.modal.dismiss({ status: "create", service: this.service });
      })
      .catch((err) => {
        Alert.simpleAlert("global.simpleAlert.errorUpdate", err?.message);
        this.controller.slidePrev();
        new Report(err, "AddPlateModalPage.slideNext", false);
      })
      .finally(() => (this.is_send = false));
  }

  finishServiceWithoutSaving() {
    this.is_send = true;
    this.service.Status = 0;
    this.controller
      .save()
      .then((res) => {
        this.modal.dismiss({ status: "create", service: this.service });
      })
      .catch((err) => {
        Alert.simpleAlert("global.simpleAlert.errorUpdate", err?.message);
        this.controller.slidePrev();
        new Report(err, "AddPlateModalPage.slideNext", false);
      })
      .finally(() => (this.is_send = false));
  }

  get isValid(): boolean {
    return InjectableService.updateServices.length == 0 && this.service.Chef != undefined && this.service.Chef != "" && this.controller.isValid;
  }
  get isMov() {
    return this.service.className == "Movement";
  }
  get isSendingPhoto() {
    return !(this.service.photoStatus == "complete") || InjectableService.updateServices.length > 0 || this.is_send;
  }
  get pageStatus() {
    return this.controller.pageStatus;
  }
}
