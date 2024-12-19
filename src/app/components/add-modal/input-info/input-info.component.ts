import { Component } from "@angular/core";
import { CheckIn } from "@src/app/class/services/CheckIn";
import { InjectableService } from "@src/app/decorators/InjectableService";
import { CarInfoEmpty } from "@src/app/interfaces/dnnClassesEmpty";

@Component({
  selector: "input-info",
  templateUrl: "./input-info.component.html",
  styleUrls: ["./input-info.component.scss"],
})

export class InputInfoComponent {

  protected service: CheckIn;

  constructor(public controller: InjectableService) {
    this.service = controller.service as CheckIn;
    if (this.service.Info == undefined)
      this.service.Info = CarInfoEmpty();
    controller.updateProperty("Info");
  }
}
