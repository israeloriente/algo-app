import { Photo, Station, User, Zone } from "./dnnClasses";

/** Interface to be used in Config, AddPlateModalPage, InputKmComponent, KeyboardComponent, MovementsPage, ParseService.
 *
 * Information relative to a mov item.
 *
 * @member {string} className is the class type in B4A.
 * @member {string} id is the ID of the item created.
 * @member {interface} createdAt is the date when the item was created.
 * @member {interface} updatedAt is the date when the item was last updated.
 * @member {string} chef is the name of the driver.
 * @member {interface} user provides information about the user.
 * @member {interface} created is the date when the item was created. It can be artificially modified.
 * @member {string} ScannerType is the type of method the user used to give an input.
 * @member {string} plate is the license plate of the car.
 * @member {boolean} matriculaEstrangeira can be true or false. If true, the license plate is foreign, if false it's portuguese.
 * @member {interface} zona provides information about the zone where the user is working. (?)
 * @member {interface} station provides information about a station. (?)
 * @member {interface} status is the variable to control the process of service.
 * @member {function} create creates a new item in B4A.
 * @member {function} remove removes an item from B4A.
 * @member {function} get isValid checks if the item is valid.
 */
export interface IService {
  Id: number;
  className: string;
  CarId: number;
  ClientId: number;
  Chef: string;
  UserId: number
  CreatedOnDate: Date;
  ended: Date;
  createdAt: Date;
  updatedAt: Date;
  IsForeignPlate: boolean;
  ScannerType: string;
  Plate: string;
  ZoneId: number;
  StationId: number;
  Status: number;
  Photo: Photo[];
  Description: string;
  remove(): Promise<any>;
}
