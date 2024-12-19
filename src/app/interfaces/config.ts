import { Client, Station, Zone } from "./dnnClasses";

/** Interface to be used in AppComponent.
 *
 * @member {interface} station provides id about the station where the user is working.
 **/
export interface Config {
  station: Station;
  zone: Zone;
  client: Client;
  isMultiClient: boolean;
}
