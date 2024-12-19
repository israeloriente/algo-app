import { Component } from "@angular/core";
import { OnValidation, Service } from "@src/app/class/services/Service";
import * as dnn from "@interfaces/dnnClasses";
import { DnnOperation } from "@src/app/services/dnn.operation.service";
import { Report } from "@src/app/class/Report";
import { InjectableService } from "@src/app/decorators";

@Component({
  selector: "app-select-client",
  templateUrl: "./select-client.component.html",
})
export class SelectClientComponent implements OnValidation {
  service: Service;
  protected client: dnn.LookupItem | undefined;
  protected clients: dnn.LookupItem[] = [];

  constructor(public controller: InjectableService) {
    this.service = controller.service;

    if (this.service.Status == 1) this.resetClient();

    controller.addOnValidation(this);

    this.getClients();
  }

  private getClients(): void {
    let stationId = this.service.StationId;
    DnnOperation.DnnService.getStationClients(stationId)
      .then(async (clients) => {
        this.clients = clients;
      })
      .catch((err) => new Report(err, "SelectClientComponent.constructor.getClients"));
  }

  public async setClient(client: dnn.LookupItem): Promise<void> {
    if (client.Id != this.service.ClientId) {
      this.service.ClientId = client.Id;
      this.client = client;
      const result = (await DnnOperation.DnnService.getStations(this.service.ClientId, this.service.ZoneId, true)) || [];
      this.service.placesOrigin = result;
      this.service.placesDestiny = result;
    } else this.resetClient();
  }

  private resetClient(): void {
    this.client = undefined;
    this.service.ClientId = 0;
  }

  get isValid(): boolean {
    return this.service.ClientId != 0;
  }
}
