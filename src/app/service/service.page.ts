import { Component, EventEmitter, OnInit, ViewChild } from "@angular/core";
import { GlobalService } from "../services/global.service";
import { ModalController } from "@ionic/angular";
import { AppComponent } from "../app.component";
import { moment } from "../services/momentjs.service";
import { Report } from "../class/Report";
import { ServiceTypeComponent, setServiceOption } from "../decorators/ServiceComponent";
import { ActivatedRoute } from "@angular/router";
import { Service } from "../class/services/Service";
import { WebCamComponent, responseWebCam } from "ngx-webcam-controller";
import { ListServicesComponent } from "../components";
import { Alert } from "../class/core/Alert";
import { AddServiceModal } from "./add-service-modal/add-service.modal";
import { DnnCore } from "../services/dnn.core.service";

/** Component in charge of the "Abastecimentos" page.
 *
 * Allows the user to change the station and show each station's list of items on that day,
 * as well as everyone else's items.
 *
 * Redirects user to "modal/add-plate-modal" when clicking on the "add" fab-button.
 * Child components:
 * app-select-station. */
@Component({
  selector: "app-service",
  templateUrl: "./service.page.html",
  styles: ["ion-fab-button { margin-top: 15% }"],
})
export class ServicePage implements OnInit {
  /** To prevent opening the modal more than once. */
  public blockPlate: boolean = false;
  protected serviceOption: ServiceTypeComponent;
  @ViewChild("list", { static: true }) listServices: ListServicesComponent;

  constructor(
    private global: GlobalService,
    private modal: ModalController,
    private modalInfo: ModalController,
    private modalScan: ModalController,
    public AC: AppComponent,
    private route: ActivatedRoute
  ) {
    const currentUrl = this.route["_routerState"].snapshot.url;
    setServiceOption(currentUrl);
  }
  ngOnInit(): void {}

  /** Retrieves abs info from database. */
  protected async load() {
    return new Promise(async (resolve, reject) => {
      await this.global.simpleLoading();
      Service.SELECT.class
        .getServices(this.AC?.getStation?.Id || 0)
        .then(async (res: any[]) => {
          const services: Service[] = await moment.sortLast(res);
          await this.global.cancelLoad();
          resolve(services);
        })
        .catch(async (error) => {
          this.global.cancelLoad();
          if (error?.message?.includes("Unauthorized")) {
            DnnCore.Authentication.logout();
            await Alert.simpleAlert("global.simpleAlert.unauthorized");
          } else new Report(error, "AbastecimentoPage.getAbs");
        });
    });
  }

  /** Opens keyboard modal.
   * @param ScannerType Type of input method used (keyboard).
   * @param plate Empty string, to be modified into license plate.
   * @returns Reloads modal. */
  async openKeyboard(ScannerType: string, plate: string) {
    await this.global.simpleLoading();
    const service: Service = new Service.SELECT.class(this.AC.getUser);
    service.Chef = AppComponent.User.DisplayName;
    service.UserId = AppComponent.User.Id;
    service.ClientId = GlobalService.Config?.client?.Id;
    service.StationId = GlobalService.Config?.station?.Id;
    service.ZoneId = GlobalService.Config?.zone?.Id;
    service.IsMultiClient = GlobalService.Config?.isMultiClient;
    // Already definied
    this.blockPlate = true;
    // If it's a new day, set date in database to today's date
    const modal = await this.modal.create({
      component: AddServiceModal,
      backdropDismiss: true,
      componentProps: {
        currentStation: this.AC.getStation,
        user: AppComponent.User,
        ScannerType: ScannerType,
        plate: plate,
        service: service,
      },
    });

    await this.global.cancelLoad();
    modal.onDidDismiss().then(async (res) => {
      if (res.data != undefined) {
        if (res.data?.status == "create") this.listServices.add(res.data.service);
        else if (res.data?.status == "remove") this.load();
      }
    });
    return await modal.present();
  }

  /** Function to be able to read QR codes/bar codes with the app.
   *
   * 3.7.1 - doesn't do anything, only prints an alert message. */
  async scan() {
    // Alert.simpleAlert("global.simpleAlert.scan");
    const onSubmit = new EventEmitter();
    const onClose = new EventEmitter();
    const onScanner = new EventEmitter();
    let codeData = null;
    const modal = await this.modalScan.create({
      component: WebCamComponent,
      backdropDismiss: true,
      componentProps: {
        mode: "qrcode",
        images: [],
        onSubmit: onSubmit,
        onClose: onClose,
        onScanner: onScanner,
      },
    });
    onClose.subscribe((data: responseWebCam) => {
      modal.dismiss();
    });
    onScanner.subscribe(async (data: any) => {
      if (codeData == null && codeData != data.codeData) {
        codeData = this.global.validatePlate(data.codeData);
        if (codeData) {
          modal.dismiss().finally(() => {
            this.openKeyboard(data.codeType, codeData);
          });
        }
      }
    });
    return await modal.present();
  }

  get title() {
    return Service.SELECT.title;
  }

  get color() {
    return Service.SELECT?.color || "dark";
  }

  get length() {
    return this.listServices?.length || 0;
  }

  get isMov() {
    return this.listServices.list[0]?.className == "Movements";
  }

  checkStatus() {
    if (this.isMov && this.containStatusMov) Alert.simpleAlert("global.simpleAlert.containStatusZero");
  }

  get containStatusMov() {
    if (this.listServices && this.listServices.length > 0 && this.isMov) {
      for (let i = 0; i < this.listServices.length; i++) {
        if (this.listServices.list[i].Status != 0) return true;
      }
    }
    return false;
  }
}
