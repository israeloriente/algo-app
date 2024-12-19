import { Component, Input } from "@angular/core";
import { Service } from "src/app/class/services/Service";

/** As of 3.7+, this component is used in the "Abastecimentos" part of the app.
 * This component is inside AddPlateModalPage. Its purpose is to register
 * if a vehicle has been refueled and by who.
 */
@Component({
  selector: "input-description",
  templateUrl: "./input-description.component.html",
  styleUrls: ["./input-description.component.scss"],
})
export class InputDescriptionComponent {
  /** Information relative to the car's refueling.
   *
   * Changes here are updated at father component in "add-plate-modal". */
  @Input() service: Service;
}
