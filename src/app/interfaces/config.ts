import { Client, Station, Zone } from "./dnnClasses";

export interface ParkSettings {
  RestrictParkValues: boolean;
  ParkFrom: number;
  ParkTo: number;
}

export interface Config {
  station: Station;
  zone: Zone;
  client: Client;
  isMultiClient: boolean;
  parkSettings: ParkSettings;
}
