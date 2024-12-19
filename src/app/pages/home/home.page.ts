import { Component, Input } from "@angular/core";
import { GlobalService } from "../../services/global.service";
import { AppComponent } from "../../app.component";
import { moment } from "../../services/momentjs.service";
import { Alert } from "../../class/core/Alert";
import { ModalController } from "@ionic/angular";
import { WebCamComponent } from "ngx-webcam-controller";
import { getServiceOptios } from "../../decorators/ServiceComponent";
import { Movement } from "../../class/services/Movement";
import { Fuel } from "../../class/services/Abastecimento";
import { Washed } from "../../class/services/Washed";
import { CheckIn } from "../../class/services/CheckIn";
import { Park } from "../../class/services/Park";
import { DnnOperation } from "@src/app/services/dnn.operation.service";
import { environment } from "@root/environment";
import { Service } from "@src/app/class/services/Service";
import { SpecialService } from "@src/app/class/services/SpecialService";

/** Component in charge of the homepage. */
@Component({
  selector: "app-home",
  templateUrl: "home.page.html",
  styleUrls: ["home.page.scss"],
})
export class HomePage {
  @Input() load: () => Promise<Service[]> = async () => [];
  protected load_services: () => Promise<Service[]> = async () => [];
  Alert: any = Alert;
  servicesComponents = [CheckIn, Movement, Fuel, Washed, Park, SpecialService];
  settings: any = {};

  constructor(public global: GlobalService, public AC: AppComponent, private modal: ModalController) {
    this.checkDayAndEnterprice();
    // this.modalNewVersion();
  }

  async ngOnInit() {
    this.load_services = this.load;
    this.load = async function (): Promise<Service[]> {
      await GlobalService.Global.simpleLoading();
      if (GlobalService.Config.station)
        DnnOperation.DnnService.stationsGetSettings(GlobalService.Config.station.Id).then(async (settings) => {
          this.settings = Object.keys(settings).reduce((acc, key) => {
            acc[key.toLowerCase()] = settings[key];
            return acc;
          }, {});
          await GlobalService.Global.cancelLoad();
        });
      else await GlobalService.Global.cancelLoad();
      this._list = await this.load_services();
      return this._list;
    };
    await this.load();
  }

  async modalNewVersion() {
    const newVersion = await this.modal.create({
      component: WebCamComponent,
      backdropDismiss: true,
    });
  }

  /** Checks date when logging in the app. */
  async checkDayAndEnterprice() {
    if (this.global.checkDay()) {
      console.log("Está no mesmo dia");
      const res = localStorage.getItem("currentStation");

      // this.dnnService
      //   .getStations(this.client.Id, this.zone.Id)
      //   .then(async (stations) => {
      //     console.log(stations);
      //     this.stations = stations;
      //   })
      //   .catch((err) => new Report(err, "SelectStationComponent.checkStation.getStations"));
      // ezequiel: 5f9b8b5b9b9c9f0001b9e5a0
      // this.AC.Config.station = await this.parse.getStation(res);
    } else {
      // If it is a new day, station will be set to undefined and user will have to select one
      console.log("Entrando pela primeira vez do dia");
      this.global.newDay();
      GlobalService.Config.station = undefined;
    }
  }

  goToLinktree() {
    window.location.href = environment.linktreeUrl;
  }

  resetStation() {
    GlobalService.Config.station = undefined;
    GlobalService.Global.resetStorage("currentStation");
  }

  checkAvailable(className) {
    return this.settings[className];
  }

  /** Returns a verification if the current and the defined date are within 30 days of each other.
   * Used to show a "New" badge on a component in the home page.
   * @bug 3.7.1 - This function doesn't do anything, since it was used only relevant for a certain period of time.
   * @returns bolean value.
   */
  get reciboIsRelease() {
    return moment.diff(new Date(), new Date("05/10/2022"), "days") <= 30;
  }

  get servicePages() {
    return getServiceOptios().sort((a, b) => {
      return this.servicesComponents.indexOf(a.class) - this.servicesComponents.indexOf(b.class);
    });
  }

  get servicePagesFiltered() {
    return this.servicePages.filter((service) => this.checkAvailable(service.settingName));
  }
}
