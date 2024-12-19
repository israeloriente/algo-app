import { Service } from "./Service";
import { ServiceComponent } from "@src/app/decorators/ServiceComponent";
import { InputPlateComponent, FinishingComponent, InputPhotoComponent, InputTypeServiceComponent, InputInfoComponent } from "@src/app/components";
import { Washed } from "./Washed";
import { environment } from "@root/environment";
import { CarInfoEmpty } from "@src/app/interfaces/dnnClassesEmpty";
import { CarInfo, Station } from "@src/app/interfaces/dnnClasses";
import { DnnOperation } from "@src/app/services/dnn.operation.service";
import { SelectClientComponent } from "@src/app/components/add-modal/select-client/select-client.component";

/***
 * Abastecimento class. This class is responsible for creating and removing abastecimento items.
 * @member {number} litro is the amount of gas the car was refueled with.
 * @member {string} fuel is the type of fuel the car was refueled with.
 */
@ServiceComponent({
  title: "Check-In",
  settingName: "checkin",
  color: "dark",
  iconName: "key",
  pages: [
    { components: [SelectClientComponent] },
    { components: [InputPlateComponent] },
    { components: [InputPhotoComponent, InputInfoComponent], args: [environment.checkinBucket] },
    { components: [InputTypeServiceComponent] },
    { components: [FinishingComponent] },
  ],
})
export class CheckIn extends Service {
  Description: string = null;
  Info: CarInfo = CarInfoEmpty();
  ServiceId: number = null;

  constructor() {
    super("CheckIn");
  }

  /** Retrieves abs items from database.
   * @param station ID of the station to retrieve abs items from.
   * @param showAll If true, retrieves all abs items from the station, if false, retrieves only the current user's abs items.
   * @returns List of abs items. */
  static async getServices(stationId: number, showAll: boolean = true): Promise<CheckIn[]> {
    const abastecimento: CheckIn[] = await DnnOperation.DnnService.getServices(CheckIn, { stationId, showAll });
    return abastecimento;
  }
}
