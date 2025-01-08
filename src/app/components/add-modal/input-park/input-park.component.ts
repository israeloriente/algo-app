import { DecimalPipe } from "@angular/common";
import { Component } from "@angular/core";
import { ViewChild } from "@angular/core";
import { DeviceService } from "src/app/services/device.service";
import { KeyboardComponent } from "../input-keyboard/input-keyboard.component";
import { OnValidation, Service } from "@src/app/class/services/Service";
import { GlobalService } from "@src/app/services/global.service";
import { InjectableService } from "@src/app/decorators/InjectableService";
import { Park } from "@src/app/class/services/Park";

@Component({
  selector: "app-input-park",
  templateUrl: "./input-park.component.html",
  styleUrls: ["./input-park.component.scss"],
  providers: [DecimalPipe],
})
export class InputParkComponent implements OnValidation {
  // Focus controler
  @ViewChild("park", { static: true }) park;
  @ViewChild("keyboardComponent", { static: true }) keyboardComponent: KeyboardComponent;

  service: Park;

  constructor(public controller: InjectableService, private global: GlobalService, public device: DeviceService) {
    this.service = controller.service as Park;
    this.controller.updateProperty("place");
    this.controller.addOnValidation(this);
    if (this.service.Plate == undefined) this.service.Plate = "";
  }

  get isValid(): boolean {
    return this.service.place != undefined && this.service.place?.length > 0;
  }
  get isRestrictPark() {
    return GlobalService.Config.parkSettings.RestrictParkValues;
  }

  setValue(value: string) {
    if (value != "ABC" && this.service.place == "Não especificado") this.service.Plate = "";
    let place: string = this.service.place?.toString();
    if (value === "ABC" || value === "123") return;
    if (value == "delete") {
      if (place?.length > 0) this.service.place = place.slice(0, -1);
    } else this.service.place = this.service.place + value;
  }

  async KeyboardResponse(value: Service) {
    this.service.Plate = this.global.validatePlate(value.Plate);
    this.controller.slideNext();
  }
}
