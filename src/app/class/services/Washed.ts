import { Service } from "./Service";
import { ServiceComponent } from "@src/app/decorators/ServiceComponent";
import { InputPlateComponent, InputTypeServiceComponent, FinishingComponent } from "@src/app/components";
import { DnnOperation } from "@src/app/services/dnn.operation.service";
import { Park } from "./Park";
import { SelectClientComponent } from "@src/app/components/add-modal/select-client/select-client.component";

/***
 * Abastecimento class. This class is responsible for creating and removing abastecimento items.
 * @member {number} litro is the amount of gas the car was refueled with.
 * @member {string} fuel is the type of fuel the car was refueled with.
 */
@ServiceComponent({
  title: "Preparação",
  settingName: "washed",
  color: "dark",
  iconSrc: "assets/icon/washed.svg",
  pages: [
    { components: [SelectClientComponent] },
    { components: [InputPlateComponent] },
    { components: [InputTypeServiceComponent] },
    { components: [FinishingComponent] },
  ],
})
export class Washed extends Service {
  ServiceId: number = null;

  constructor() {
    super("Washed");
  }

  public async update(...propertyNames: string[]): Promise<any> {
    return super.update(...propertyNames).then(async (service) => {
      if (propertyNames.includes("FinishingComponent") && propertyNames.includes("serviceStatus:new")) {
        const newPark = new Park();
        newPark.Status = 1;
        newPark.StationId = this.StationId;
        newPark.ClientId = this.ClientId;
        newPark.ZoneId = this.ZoneId;
        newPark.UserId = this.UserId;
        newPark.IsForeignPlate = this.IsForeignPlate;
        newPark.Plate = this.Plate;
        newPark.ScannerType = this.ScannerType;
        newPark.Chef = this.Chef;
        return newPark.update("plate", "station", "client", "zona", "created", "matriculaEstrangeira", "ScannerType");
      }
    });
  }

  /** Retrieves abs items from database.
   * @param stationId ID of the station to retrieve abs items from.
   * @param showAll If true, retrieves all abs items from the station, if false, retrieves only the current user's abs items.
   * @returns List of abs items. */
  static async getServices(stationId: number, showAll: boolean = true): Promise<Washed[]> {
    const abastecimento: Washed[] = await DnnOperation.DnnService.getServices(Washed, { stationId, showAll });
    return abastecimento;
  }
}
