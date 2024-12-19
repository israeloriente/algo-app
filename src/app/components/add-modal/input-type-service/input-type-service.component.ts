import { Component } from "@angular/core";
import { Washed } from "@src/app/class/services/Washed";
import { InjectableService } from "@src/app/decorators/InjectableService";
import { OnValidation } from "@src/app/class/services/Service";
import { DnnOperation } from "@src/app/services/dnn.operation.service";
import { LookupItem } from "@src/app/interfaces/dnnClasses";
import { GlobalService } from "@src/app/services/global.service";

@Component({
  selector: "app-input-type-service",
  templateUrl: "./input-type-service.component.html",
  styleUrls: ["./input-type-service.component.scss"],
})
export class InputTypeServiceComponent implements OnValidation {
  service: Washed;
  protected typeServices: LookupItem[] = [];

  constructor(public controller: InjectableService) {
    this.service = controller.service as Washed;
    this.controller.updateProperty("ServiceId");
    this.controller.addOnValidation(this);
  }

  get isValid(): boolean {
    return this.service.ServiceId != null;
  }

  async ngAfterViewInit() {
    let station = GlobalService.Global.getStorage("currentStation");
    this.typeServices = await DnnOperation.DnnService.getTypeServiceStation(station.Id);
  }

  public async selectTypeService(serviceId: number) {
    this.service.ServiceId = serviceId
  }
}
