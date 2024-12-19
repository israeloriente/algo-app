import { Component } from "@angular/core";
import { Movement } from "src/app/class/services/Movement";
import { InjectableService } from "@src/app/decorators/InjectableService";
import { OnValidation } from "@src/app/class/services/Service";
import { LookupItem } from "@src/app/interfaces/dnnClasses";
import { DnnOperation } from "@src/app/services/dnn.operation.service";

@Component({
  selector: "origin-destiny-transfer",
  templateUrl: "./origin-destiny-transfer.component.html",
})
export class OriginDestinyTransferComponent implements OnValidation {
  /** Stores both Origin (place_1) and Destination (place_2). */
  protected service: Movement;
  protected zoneOrigin: LookupItem | undefined;
  protected zoneDestiny: LookupItem | undefined;
  protected zones: LookupItem[] = [];

  constructor(public controller: InjectableService) {
    this.controller.updateProperty("StationOriginId", "StationDestinationId");
    this.controller.addOnValidation(this);
    this.service = controller.service as Movement;
    this.getZones(this.service["ZoneOriginId"] || 0, this.service["ZoneDestinationId"] || 0).then(() => {});
  }

  get isValid(): boolean {
    return this.service.StationOriginId != null && this.service.StationDestinationId != null;
  }

  ngOnInit() {}

  async getZones(zonaOriginId: number, zonaDestinyId: number) {
    zonaOriginId = zonaOriginId != 0 ? zonaOriginId : this.service.ZoneId;
    zonaDestinyId = zonaDestinyId != 0 ? zonaDestinyId : this.service.ZoneId;
    await DnnOperation.DnnService.getZones().then((zones) => {
      this.zones = zones || [];
      this.zoneOrigin = zones.find((z) => z.Id == zonaOriginId);
      this.zoneDestiny = zones.find((z) => z.Id == zonaDestinyId);
      this.zoneChange("origin", zonaOriginId);
      this.zoneChange("destiny", zonaDestinyId);
    });
  }

  async zoneChange(type: "origin" | "destiny", zonaId: number) {
    const result = await DnnOperation.DnnService.getStations(this.service.ClientId, zonaId, true);
    if (type == "origin") this.service.placesOrigin = result;
    else this.service.placesDestiny = result;
  }

  /** Receives origin input selected by user.
   * @param origin - origin input selected by user.
   */
  setOrigin(id: number) {
    this.service.StationOriginId = id;
  }

  /** Receives destination input selected by user.
   * @param destiny - destination input selected by user.
   */
  setDestiny(id: number) {
    this.service.StationDestinationId = id == this.service.StationOriginId ? 0 : id;
  }

  get placesDestiny() {
    return this.service.placesDestiny || [];
  }

  get placesOrigin() {
    return this.service.placesOrigin || [];
  }
}
