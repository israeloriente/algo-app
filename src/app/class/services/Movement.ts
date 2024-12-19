import { ServiceComponent } from "@src/app/decorators/ServiceComponent";
import {
  InputPlateComponent,
  InputPhotoComponent,
  InputAccessoryComponent,
  InputFuelComponent,
  FinishingComponent,
  InputKmComponent,
  OriginDestinyTransferComponent,
} from "@src/app/components";
import { Service } from "./Service";
import { environment } from "@root/environment";
import { CarAccessory } from "@src/app/interfaces/dnnClasses";
import { DnnOperation } from "@src/app/services/dnn.operation.service";
import { SelectClientComponent } from "@src/app/components/add-modal/select-client/select-client.component";

/**
 * Class to validate and report to parse Logs class.
 * The user will be notified of the validated error.
 * @member {string} originEdestiny is the origin -> destination of the movement.
 * @member {number} km is the number of kilometers the car has travelled.
 * @member {number} nivelCombustivel is the level of fuel the car has at the moment of creating the item.
 * @member {interface} CarAccessory provides information about the car accessories.
 * @member {interface} impro provides information about the impro.
 */
@ServiceComponent({
  title: "Transferes",
  settingName: "movement",
  iconName: "car",
  iconColor: "mov",
  color: "danger",
  pages: [
    { components: [SelectClientComponent] },
    { components: [InputPlateComponent] },
    { components: [InputPhotoComponent, InputAccessoryComponent, InputFuelComponent], args: [environment.transferBucket] },
    { components: [InputKmComponent] },
    { components: [OriginDestinyTransferComponent] },
    { components: [FinishingComponent] },
  ],
})
export class Movement extends Service {
  Km: number = 0;
  FuelLevel = 8;
  CarAccessory: CarAccessory = {
    chapeleira: false,
    palaSol: false,
    pneuSuplente: false,
    triangulo: false,
    macaco: false,
  };
  StationOriginId: number = null;
  StationDestinationId: number = null;

  constructor() {
    super("Movement");
  }

  static async getServices(stationId: number, showAll: boolean = false): Promise<Movement[]> {
    if (!environment.production) console.log("stationId: ", stationId, " showAll: ", showAll);
    const movement: Movement[] = await DnnOperation.DnnService.getServices(Movement, { stationId, showAll });
    return movement;
  }
}
