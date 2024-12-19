export interface LookupItem {
  Id: number;
  Label: string;
}

export interface User {
  Id: number;
  DisplayName: string;
  Username: string;
  MobileNumber: string;
  Email: string;
  UserProfileType: UserProfileType;
  Zone: Zone;
}



export interface UserProfileType extends LookupItem {
}

export interface Zone extends LookupItem {
  Name: string;
  Description: string;
  IsMultiple?: boolean;
}

export interface Station extends LookupItem {
  Name: string;
  Description: string;
  IsAvailable?: boolean;
  client: Client;
  IsMultiClient?: boolean;
}

/** Interface to be used in AppComponent, SelectStationComponent, AddRendimentoModalComponent, Config, AddPlateModalPage, OriginDestinyComponent, ParseService.
 *
 * Information relative to a station (Sixt Aeroporto, Centauro, etc.).
 *
 * @member {string} className is the class type in B4A.
 * @member {string} id is the ID of the station.
 * @member {interface} createdAt is the date when the station was created.
 * @member {interface} updatedAt is the date when the station was last updated.
 * @member {string} name is the name of the station.
 */
export interface Client extends LookupItem {

}



export interface Photo {
  Url: string
};

export interface Car {
  plate: string;
  fuel: number;
  model: string;
  color: string;
  service: {
    serviceId: string;
    serviceName: string;
    userId: string;
    status: "0" | "1" | "2" | "3" | "4" | "5";
  };
}

export interface ServicesType {
  className?: string;
  id: string;
  createdAt?: Date;
  updatedAt?: Date;
  name: string;
}

/** Interface to be used in AccessoryComponent.
 *
 * Its members are the accessories that can be in the car. They can have true or false values (boolean).
 *
 * If a member is true, it means that the accessory is in the car.
 * Otherwise, if a member is false, it means that the accessory is not in the car. */
export interface CarAccessory {
  chapeleira: boolean;
  palaSol: boolean;
  pneuSuplente: boolean;
  triangulo: boolean;
  macaco: boolean;
}

export interface CarInfo {
  damage: boolean;
  refuel: boolean;
}
