import { Component, OnInit, ViewChild } from "@angular/core";
import { OnValidation } from "@src/app/class/services/Service";
import { DeviceService } from "src/app/services/device.service";
import { Events } from "src/app/services/events";
import { GlobalService } from "src/app/services/global.service";
import { KeyboardComponent } from "../input-keyboard/input-keyboard.component";
import { InjectableService } from "@src/app/decorators/InjectableService";
import { Movement } from "@src/app/class/services/Movement";

/** As of 3.7+, this component is only used in the "Movimentos" part of the app.
 * This component is inside AddPlateModalPage. Its purpose is to register the
 * distance travelled and identify the operator */

@Component({
  selector: "app-input-km",
  templateUrl: "./input-km.component.html",
  styleUrls: ["./input-km.component.scss"],
})
export class InputKmComponent implements OnInit, OnValidation {
  // Focus controller
  @ViewChild("km") km;
  @ViewChild("keyboardComponent", { static: true }) keyboardComponent: KeyboardComponent;
  /** Information relative to the car's distance travelled.
   *
   * Changes here are updated at father component in "add-plate-modal". */

  service: Movement;

  constructor(
    public controller: InjectableService,
    public device: DeviceService, public ev: Events, public global: GlobalService) {
    this.controller.updateProperty("Km");
    this.service = controller.service as Movement;
    this.service.Km = this.service?.Km || 0;
    this.controller.addOnValidation(this);
  }


  get isValid(): boolean {
    return this.service.Km > 0;
  }

  /** Waits for input from parent component.
   *
   * If there aren't any km given, focus on km input. */
  ngOnInit() {
    this.ev.subscribe("setFocusFirstInput", () => {
      if (!this.service.Km)
        setTimeout(() => {
          this.km.setFocus();
        }, 500);
    });
  }

  ngAfterViewInit() {
    this.keyboardComponent.setKey("numbers", "ABC", ".");
  }

  /** Destroys focus event. */
  ngOnDestroy() {
    this.ev.destroy("setFocusFirstInput");
  }

  /** Hides keyboard. */
  async hideKeyboard() {
    try {
      await this.device.hideKeyboard();
    } catch (error) { }
  }

  setNumber(value) {
    let km: string = this.service.Km?.toString();
    if (parseInt(value) > 0 && km?.length == 1) this.service.Km = parseInt(km + value);
    else if (km?.length == 1 && value == "delete") this.service.Km = 0;
    else if (value == "delete" && km?.length > 1) {
      this.service.Km = parseInt(km.slice(0, -1));
    } else this.service.Km = parseInt(this.service.Km + value);
  }
}
