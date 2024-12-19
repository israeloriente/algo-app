import { DecimalPipe } from "@angular/common";
import { Component } from "@angular/core";
import { ViewChild } from "@angular/core";
import { DeviceService } from "src/app/services/device.service";
import { KeyboardComponent } from "../input-keyboard/input-keyboard.component";
import { OnValidation, Service } from "@src/app/class/services/Service";
import { GlobalService } from "@src/app/services/global.service";
import { InjectableService } from "@src/app/decorators/InjectableService";
import { Fuel } from "@src/app/class/services/Abastecimento";

@Component({
  selector: "app-input-litro",
  templateUrl: "./input-litro.component.html",
  styleUrls: ["./input-litro.component.scss"],
  providers: [DecimalPipe],
})
export class InputLitroComponent implements OnValidation {
  // Focus controler
  @ViewChild("litro") litro;
  @ViewChild("keyboardComponent", { static: true }) keyboardComponent: KeyboardComponent;

  service: Fuel;

  constructor(public controller: InjectableService, private global: GlobalService, private decimalPipe: DecimalPipe, public device: DeviceService) {
    this.service = controller.service as Fuel;
    this.controller.updateProperty("litro");
    this.controller.addOnValidation(this);
    this.service.FuelQuantity = this.service?.FuelQuantity || 0;
  }

  get isValid(): boolean {
    return this.service.FuelQuantity > 0 && this.service.FuelQuantity <= 100 && typeof this.service.FuelQuantity == "number";
  }

  ngAfterViewInit() {
    this.keyboardComponent.setKey("numbers", "ABC", ".");
  }

  setLitro(value: string) {
    let litro: string = this.service.FuelQuantity?.toString();
    if (value == "." && litro == "0") return;
    // If is a decimal value
    if (this.service.FuelQuantity.toString().includes(".")) {
      let decimalPlaces = this.service.FuelQuantity.toString().includes(".") ? this.service.FuelQuantity.toString().split(".")[1].length : 0;
      if (value == ".") return; // Prevent more than one "." character
      if (value == "0" && litro.slice(-1) == ".") {
        this.service.FuelQuantity = litro + value;
        return;
      }
      if (decimalPlaces >= 2 && value != "delete") return; // Prevent more than two decimal places
      this.service.FuelQuantity = parseFloat(this.service.FuelQuantity + value);
      if (value == "delete" && litro?.length > 1) {
        this.service.FuelQuantity = parseFloat(litro.slice(0, -1)); // Delete last character and Convert to float
      }
    } else {
      // If is an integer value
      if (this.service.FuelQuantity == "0" && value != "delete") {
        this.service.FuelQuantity = parseInt(value);
        return;
      }
      if (parseInt(value) > 0 && litro?.length == 1) this.service.FuelQuantity = parseInt(litro + value);
      else if (litro?.length == 1 && value == "delete") this.service.FuelQuantity = 0;
      else if (value == "delete" && litro?.length > 1) {
        this.service.FuelQuantity = parseInt(litro.slice(0, -1));
      } else if (value == ".") this.service.FuelQuantity = this.service.FuelQuantity + value; // Cause string type
      else this.service.FuelQuantity = parseInt(this.service.FuelQuantity + value);
    }
  }

  async KeyboardResponse(value: Service) {
    this.service.Plate = this.global.validatePlate(value.Plate);
    this.controller.slideNext();
  }
}
