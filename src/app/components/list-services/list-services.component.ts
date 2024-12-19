import { Component, Input, OnInit } from "@angular/core";
import { ModalController } from "@ionic/angular";
import { Report } from "src/app/class/Report";
import { GlobalService } from "src/app/services/global.service";
import { Alert } from "src/app/class/core/Alert";
import { AppComponent } from "src/app/app.component";
import { Service } from "src/app/class/services/Service";
import { AddServiceModal } from "@src/app/service/add-service-modal/add-service.modal";

export type typeService = "Movimento" | "Abastecimento";
/** Component used to edit the flag on the plate or if we want to delete a mov or abs item.
 * @implements {OnInit}. */
@Component({
  selector: "app-list-services",
  styles: [
    ".bold { font-weight: 500 }",
    "ion-button {width: 48.5%; float: left;}",
    ".smallItens {font-size: 14px; --min-height: 0; ion-label: { margin: 1vh 1vh; }}",
  ],
  templateUrl: "./list-services.component.html",
})
export class ListServicesComponent implements OnInit {
  /** Information related to the item. */

  public service: Service;
  @Input() typeService: typeService;

  @Input() load: () => Promise<Service[]> = async () => [];
  protected load_services: () => Promise<Service[]> = async () => [];

  protected _list: Service[] = [];

  constructor(
    private global: GlobalService,
    public modalInfo: ModalController,
    public modalEditor: ModalController,
    public AC: AppComponent
  ) {}

  /** Retrieves mov items from Parse and sorts them by date. */
  async ngOnInit() {
    this.load_services = this.load;
    this.load = async function (): Promise<Service[]> {
      this._list = await this.load_services();
      return this._list;
    };
    await this.load();
  }

  public add(service: Service) {
    if (service != undefined) {
      const index = this.list.indexOf(service);
      if (index > -1) this.remove(service);
      this.list.unshift(service);
    }
  }

  public remove(service: Service) {
    if (service != undefined && this.list.indexOf(service) != -1) this.list.splice(this.list.indexOf(service), 1);
  }

  get list() {
    return this._list;
  }

  async openAddPlateModal(service: Service) {
    await this.global.simpleLoading();
    const modal = await this.modalInfo.create({
      component: AddServiceModal,
      backdropDismiss: true,
      componentProps: {
        UserId: service.UserId != 0 ? service.UserId : AppComponent.User.Id,
        Chef: service.Chef || AppComponent.User.DisplayName,
        StationId: service.StationId,
        ClientId: service.ClientId,
        ScannerType: service.ScannerType,
        Plate: service.Plate,
        service: service,
      },
    });

    await this.global.cancelLoad();
    modal.onDidDismiss().then(async (res) => {
      if (res.data != undefined) {
      }
    });
    return await modal.present();
  }

  /** Delete mov item.
   * @param service Info in the item to be deleted.
   * @param index Index of the item in the list. */
  async delete(service: Service, index: number) {
    if (await this.global.checkDay()) {
      if (await Alert.confirmAlert("global.confirmAlert.deleteItem")) {
        await this.global.simpleLoading();
        service
          .remove()
          .then(async (res) => {
            Alert.simpleToastArgs("global.toast.serviceRemoved", service.constructor.name);
            this.remove(service);
            await this.global.cancelLoad();
          })
          .catch(async (error) => {
            await this.global.cancelLoad();
            // If it doesn't find anything, it's likely that ACL blocked it
            if (error == "ParseError: 101 Object not found.") Alert.simpleToast("global.toast.denyRemoveMov", service.Plate);
            else new Report(error, service.constructor.name + "Page.delete");
          });
      } else {
        await this.global.cancelLoad();
      }
    } else {
      this.global.newDay();
      await this.load();
    }
  }

  public get length() {
    return this.list.length || 0;
  }
}
