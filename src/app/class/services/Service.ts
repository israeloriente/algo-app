import { IService } from "@interfaces/service";
import { ServiceTypeComponent } from "@src/app/decorators";
import { DnnOperation } from "@src/app/services/dnn.operation.service";
import { LookupItem, Photo } from "@src/app/interfaces/dnnClasses";
import { environment } from "@root/environment";

export interface OnValidation {
  get isValid(): boolean;
}

export abstract class Service implements IService {
  Id: number = 0;
  className: string = null;
  CarId: number = null;
  Chef: string = null;
  UserId: number = null;
  CreatedOnDate: Date = new Date();
  ended: Date = undefined;
  IsForeignPlate: boolean;
  Plate: string = "";
  createdAt: Date = new Date();
  updatedAt: Date = new Date();
  ScannerType: string = "keyboard";
  ZoneId: number = null;
  ClientId: number = null;
  StationId: number = null;
  Status: number = 1;
  Description: string = "";
  IsDeleted: boolean = false;
  IsMultiClient: boolean = false;
  public static lastCarUsed: Service = null;
  public static SELECT: ServiceTypeComponent = null;
  Photo: Photo[] = [];
  placesOrigin: LookupItem[];
  placesDestiny: LookupItem[];
  StartDate: Date = undefined;
  EndDate: Date = undefined;
  SpecialServiceTypeId: number = null;
  SpecialServiceTypeName: string = "";
  ClientName: string = "";

  public photoStatus: "complete" | "progress" = "complete";

  constructor(className: string) {
    this.className = className;
  }

  /**
   * Creates or updates a service in the database.
   * Always passes the ID, status and license plate
   * automatically. The other parameters can be passed
   * in propertyNames, allowing partial updates and
   * reducing data traffic.
   *
   * @note Note: propertyNames can contain the names of the class
   * variables and also the name of the component that executed
   * this function.
   * @param propertyNames - List of properties to be updated
   * @returns
   */
  public async update(...propertyNames: string[]): Promise<any> {
    let object = this.getObject();
    if (propertyNames.includes("Photo")) object["Photos"] = this.Photo;
    if (propertyNames.includes("Info")) object["Info"] = this["Info"];
    if (propertyNames.includes("CarAccessory")) object["CarAccessory"] = this["CarAccessory"];
    const body = JSON.stringify(object);
    if (!environment.production) console.log("update: ", object);
    return DnnOperation.DnnService.createUpdate(this, body);
  }

  async remove(): Promise<any> {
    return DnnOperation.DnnService.delete(this);
  }

  getObject(): {} {
    let newObject: any = {};
    for (let prop of Object.getOwnPropertyNames(this)) {
      const desc = Object.getOwnPropertyDescriptor(this, prop);
      if (desc && typeof desc?.value !== "function") {
        if (prop == "Photo" || prop == "Info" || prop == "CarAccessory" || prop == "Content") continue;
        let v = desc?.value;
        if (this[prop] && this[prop].hasOwnProperty("Id")) v = this[prop].id;
        newObject[prop] = v;
        if (prop == "CreatedOnDate") delete newObject.CreatedOnDate;
      }
    }
    return newObject;
  }
}
