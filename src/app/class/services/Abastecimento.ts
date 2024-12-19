import { Service } from "./Service";
import { Report } from "../Report";
import { ServiceComponent } from "@src/app/decorators/ServiceComponent";
import { InputPlateComponent, InputLitroComponent, InputTypeFuel, FinishingComponent } from "@src/app/components";
import { User } from "@src/app/interfaces/dnnClasses";
import { DnnOperation } from "@src/app/services/dnn.operation.service";
import { SelectClientComponent } from "@src/app/components/add-modal/select-client/select-client.component";

/***
 * Abastecimento class. This class is responsible for creating and removing abastecimento items.
 * @member {number} litro is the amount of gas the car was refueled with.
 * @member {string} fuel is the type of fuel the car was refueled with.
 */
@ServiceComponent({
  title: "Abastecimentos",
  settingName: "fuel",
  iconSrc: "assets/icon/abast.svg",
  color: "tertiary",
  pages: [
    { components: [SelectClientComponent] },
    { components: [InputPlateComponent] },
    { components: [InputLitroComponent] },
    { components: [InputTypeFuel] },
    { components: [FinishingComponent] },
  ],
})
export class Fuel extends Service {
  FuelQuantity: any = 0;
  FuelType: "Gasolina" | "Gasóleo" = "Gasolina";

  constructor(user?: User) {
    super("Fuel");
    // if (user) (this.chef = user.displayName), (this.user = user), (this.zona = user.zoneP);
  }

  /** Retrieves abs items from database.
   * @param station ID of the station to retrieve abs items from.
   * @param showAll If true, retrieves all abs items from the station, if false, retrieves only the current user's abs items.
   * @returns List of abs items. */
  static async getServices(stationId: number, showAll: boolean = false): Promise<Fuel[]> {
    const abastecimento: Fuel[] = await DnnOperation.DnnService.getServices(Fuel, { stationId, showAll });
    return abastecimento;
  }
}
