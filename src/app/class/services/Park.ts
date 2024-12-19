import { Service } from "./Service";
import { moment } from "src/app/services/momentjs.service";
import { ServiceComponent } from "@src/app/decorators/ServiceComponent";
import { InputPlateComponent, FinishingComponent, InputParkComponent } from "@src/app/components";
import { DnnOperation } from "@src/app/services/dnn.operation.service";
import { SelectClientComponent } from "@src/app/components/add-modal/select-client/select-client.component";

/***
 * Park class. This class is responsible for creating and removing park items.
 * @member {number} litro is the amount of gas the car was refueled with.
 * @member {string} fuel is the type of fuel the car was refueled with.
 */
@ServiceComponent({
  title: "Parqueamento",
  settingName: "park",
  color: "dark",
  iconSrc: "assets/icon/park.svg",
  pages: [
    { components: [SelectClientComponent] },
    { components: [InputPlateComponent] },
    { components: [InputParkComponent] },
    { components: [FinishingComponent] },
  ],
})
export class Park extends Service {
  place: string = "";

  constructor() {
    super("Park");
  }

  /** Retrieves abs items from database.
   * @param stationId ID of the station to retrieve abs items from.
   * @param showAll If true, retrieves all abs items from the station, if false, retrieves only the current user's abs items.
   * @returns List of abs items. */
  static async getServices(stationId: number, showAll: boolean = true): Promise<Park[]> {
    const parks: Park[] = await DnnOperation.DnnService.getServices(Park, { stationId, showAll });
    return parks;
  }
}
