import { Component } from "@angular/core";
import { InjectableService } from "@src/app/decorators/InjectableService";
import { OnValidation } from "@src/app/class/services/Service";
import { GlobalService } from "@src/app/services/global.service";
import { Park } from "@src/app/class/services/Park";

@Component({
  selector: "app-input-park-list",
  templateUrl: "./input-park-list.component.html",
  styleUrls: ["./input-park-list.component.scss"],
})
export class InputParkListComponent implements OnValidation {
  service: Park;
  protected list: number[] = [];

  constructor(public controller: InjectableService) {
    this.service = controller.service as Park;
    this.controller.updateProperty("place");
    this.controller.addOnValidation(this);
  }

  get isValid(): boolean {
    return this.service.place != null;
  }

  async ngAfterViewInit() {
    const { ParkFrom, ParkTo } = GlobalService.Config.parkSettings;
    this.list = Array.from({ length: ParkTo - ParkFrom + 1 }, (_, i) => i + ParkFrom);
  }

  public async selectItem(place: number) {
    this.service.place = place.toString();
  }
}
