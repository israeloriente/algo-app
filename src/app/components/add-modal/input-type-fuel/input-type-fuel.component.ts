import { Component } from "@angular/core";
import { Fuel } from "@src/app/class/services/Abastecimento";
import { Service } from "@src/app/class/services/Service";
import { InjectableService } from "@src/app/decorators/InjectableService";

@Component({
  selector: "app-input-type-fuel",
  templateUrl: "./input-type-fuel.component.html",
  styleUrls: ["./input-type-fuel.component.scss"],
})
export class InputTypeFuel {
  service: Fuel;

  constructor(public controller: InjectableService) {
    this.service = controller.service as Fuel;
    this.controller.updateProperty("fuel");
    this.service.FuelType = this.service?.FuelType || "Gasolina";
  }
}
