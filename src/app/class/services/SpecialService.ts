import { Service } from "./Service";
import { ServiceComponent } from "@src/app/decorators/ServiceComponent";
import { FinishingComponent } from "@src/app/components";
import { DnnOperation } from "@src/app/services/dnn.operation.service";
import { SelectClientComponent } from "@src/app/components/add-modal/select-client/select-client.component";
import { InputSpecialServiceTypeComponent } from "@src/app/components/add-modal/input-special-service-type/input-special-service-type.component";

/***
 * Abastecimento class. This class is responsible for creating and removing abastecimento items.
 * @member {number} litro is the amount of gas the car was refueled with.
 * @member {string} fuel is the type of fuel the car was refueled with.
 */
@ServiceComponent({
  title: "Serviços especiais",
  settingName: "specialservice",
  color: "dark",
  iconSrc: "assets/icon/specialService.svg",
  pages: [{ components: [SelectClientComponent] }, { components: [InputSpecialServiceTypeComponent] }, { components: [FinishingComponent] }],
})
export class SpecialService extends Service {
  ServiceId: number = null;

  constructor() {
    super("SpecialService");
  }

  /** Retrieves abs items from database.
   * @param stationId ID of the station to retrieve abs items from.
   * @param showAll If true, retrieves all abs items from the station, if false, retrieves only the current user's abs items.
   * @returns List of abs items. */
  static async getServices(stationId: number, showAll: boolean = false): Promise<SpecialService[]> {
    const specialService: SpecialService[] = await DnnOperation.DnnService.getServices(SpecialService, { stationId, showAll });
    return specialService;
  }
}
