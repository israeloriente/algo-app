import { Component } from "@angular/core";
import { InjectableService } from "@src/app/decorators/InjectableService";
import { Movement } from "@src/app/class/services/Movement";

@Component({
  selector: "app-input-fuel",
  templateUrl: "./input-fuel.component.html",
  styleUrls: ["./input-fuel.component.scss"],
})
export class InputFuelComponent {
  service: Movement;

  constructor(public controller: InjectableService) {
    this.controller.updateProperty("FuelLevel");
    this.service = controller.service as Movement;
    this.service.FuelLevel = this.service?.FuelLevel || 8;
  }

  protected changeNivelCombustivel(value: any) {
    this.service.FuelLevel = value.detail.value || 0;
  }
}
