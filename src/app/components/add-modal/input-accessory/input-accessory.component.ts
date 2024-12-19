import { Component } from "@angular/core";
import { Movement } from "@src/app/class/services/Movement";
import { InjectableService } from "@src/app/decorators/InjectableService";

/** As of 3.7+, this component is only used in the "Movimentos" part of the app.
 * This component is inside AddPlateModalPage. It registers if any of the accessories
 * are present or missing from the car.
 */
@Component({
  selector: "input-accessory",
  templateUrl: "./input-accessory.component.html",
  styleUrls: ["./input-accessory.component.scss"],
})

export class InputAccessoryComponent {

  service: Movement | any;

  constructor(public controller: InjectableService) {
    this.service = controller.service as Movement;
    this.service.CarAccessory = this.service?.CarAccessory || {
      chapeleira: false,
      palaSol: false,
      pneuSuplente: false,
      triangulo: false,
      macaco: false,
    };
    controller.updateProperty("CarAccessory");
  }

  enableAll() {
    this.service.CarAccessory.chapeleira = true;
    this.service.CarAccessory.palaSol = true;
    this.service.CarAccessory.pneuSuplente = true;
    this.service.CarAccessory.triangulo = true;
    this.service.CarAccessory.macaco = true;
  }
}
