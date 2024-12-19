import { Component } from "@angular/core";
import { Washed } from "@src/app/class/services/Washed";
import { InjectableService } from "@src/app/decorators/InjectableService";
import { OnValidation } from "@src/app/class/services/Service";
import { DnnOperation } from "@src/app/services/dnn.operation.service";
import { LookupItem } from "@src/app/interfaces/dnnClasses";
import { SpecialService } from "@src/app/class/services/SpecialService";

@Component({
  selector: "app-input-special-service-type",
  templateUrl: "./input-special-service-type.component.html",
  styleUrls: ["./input-special-service-type.component.scss"],
})
export class InputSpecialServiceTypeComponent implements OnValidation {
  service: SpecialService;
  protected specialServiceType: LookupItem[] = [];

  constructor(public controller: InjectableService) {
    this.service = controller.service as Washed;
    this.controller.updateProperty("SpecialServiceTypeId");
    this.controller.addOnValidation(this);
  }

  get isValid(): boolean {
    return this.service.SpecialServiceTypeId != null;
  }

  async ngAfterViewInit() {
    this.specialServiceType = await DnnOperation.DnnService.getSpecialServiceTypes();
  }

  public async selectSpecialServiceType(serviceId: number) {
    this.service.SpecialServiceTypeId = serviceId;
    this.service.SpecialServiceTypeName = this.specialServiceType.find((x) => x.Id == serviceId).Label;
  }
}
