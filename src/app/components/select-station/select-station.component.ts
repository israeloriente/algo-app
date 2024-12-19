import { Component, OnInit, Output, EventEmitter } from "@angular/core";
import { AppComponent } from "@src/app/app.component";
import { DeviceService } from "@src/app/services/device.service";
import { GlobalService } from "@src/app/services/global.service";
import { Report } from "@src/app/class/Report";
import { DnnOperation } from "@src/app/services/dnn.operation.service";
import * as dnn from "@interfaces/dnnClasses";
import { DnnCore } from "@src/app/services/dnn.core.service";
import { Alert } from "@src/app/class/core/Alert";

@Component({
  selector: "app-select-station",
  templateUrl: "./select-station.component.html",
  styles: ["ion-content {--background: aliceblue;}"],
})
export class SelectStationComponent implements OnInit {
  @Output() response = new EventEmitter<null>();

  protected zone: dnn.LookupItem | undefined;
  protected client: dnn.LookupItem | undefined;
  protected station: dnn.LookupItem | undefined;

  protected zones: dnn.LookupItem[] = [];
  protected clients: dnn.LookupItem[] = [];
  protected stations: dnn.LookupItem[] = [];
  protected showStationMultiClient: boolean = false;

  constructor(public global: GlobalService, public device: DeviceService, public AC: AppComponent) {}

  async ngOnInit() {
    this.showStationMultiClient = GlobalService.Config.isMultiClient || false;

    this.loadZones();
    this.zone = GlobalService.Config.zone;

    this.loadClients();
    this.client = GlobalService.Config.client;
  }


  stationMultiClientChanged(value) {
    this.station = undefined;
    this.stations = [];
    GlobalService.Config.isMultiClient = this.showStationMultiClient;
    GlobalService.Global.setStorage("isMultiClient", this.showStationMultiClient);
    this.loadStations();
  }


  /**
   * Get the zones directly from the database
   */
  loadZones() {
    // if (this.clients.length == 0) return;
    this.station = undefined;
    DnnOperation.DnnService.getZones()
      .then(async (zones) => {
        this.zones = zones;
        this.loadStations();
      })
      .catch((err) => new Report(err, "ConfigPage.getParseZone"));
  }

  /**
   * Get the clients directly from the database
   */
  loadClients() {
    this.station = undefined;
    DnnOperation.DnnService.getClients()
      .then(async (clients) => {
        this.clients = clients;
        this.client = GlobalService.Config.client;
        // this.loadStations();
      })
      .catch((err) => new Report(err, "SelectStationComponent.ngOnInit.getClients"));
  }

  /**
   * Get the stations directly from the database
   */
  loadStations() {
    if ((this.client == undefined && !this.showStationMultiClient) || this.zone == undefined) return;
    if (this.showStationMultiClient) {
      DnnOperation.DnnService.getStationsMultiClient(this.zone.Id)
        .then(async (stations) => {
          if (stations.length) this.stations = stations;
        })
        .catch(async (err) => {
          if (err?.message.includes("Unauthorized")) {
            DnnCore.Authentication.logout();
            await Alert.simpleAlert("global.simpleAlert.unauthorized");
          } else new Report(err, "SelectStationComponent.loadStations.getStationsMultiClient");
        });
    } else {
      DnnOperation.DnnService.getStations(this.client.Id, this.zone.Id, false)
        .then(async (stations) => {
          if (stations.length) this.stations = stations;
        })
        .catch(async (err) => {
          if (err?.message.includes("Unauthorized")) {
            DnnCore.Authentication.logout();
            await Alert.simpleAlert("global.simpleAlert.unauthorized");
          } else new Report(err, "SelectStationComponent.loadStations.getStations");
        });
    }
  }


  checkStationList() {
    if (this.stations.length == 0) Alert.simpleToast("global.toast.voidStationLookup");
  }

  zoneClicked() {
    // this.loadStations();
  }

  /**
   * Trigger when AC.Config.zone changes value
   * */
  async zoneChange(isLoad: boolean = true) {
    this.station = undefined;
    this.stations = [];
    GlobalService.Config.zone = { ...this.zone, Name: this.zone.Label, Description: "" };
    GlobalService.Global.setStorage("currentZone", GlobalService.Config.zone);
  }

    /**
   * Trigger when AC.Config.client changes value
   * */
    clientChange() {
      this.station = undefined;
      this.stations = [];
      GlobalService.Config.client = this.client;
      GlobalService.Global.setStorage("currentClient", this.client);
    }

  /**
   * Triggers every time we change the station
   * */
  async stationChange() {
    GlobalService.Config.station = { ...this.station, Name: this.station.Label, Description: "", client: this.client };
    this.response.emit();
    GlobalService.Global.setStorage("currentStation", GlobalService.Config.station);
    GlobalService.Global.newDay();
  }

  get interfaceSelect() {
    return "alert";
  }
  get AppComponentUserZone() {
    return AppComponent.User.Zone;
  }
}
