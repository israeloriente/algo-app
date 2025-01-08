import { Injectable } from "@angular/core";
import { NavController } from "@ionic/angular";
import { LoadingController } from "@ionic/angular";
import { TranslateService } from "@ngx-translate/core";
import { Alert } from "../class/core/Alert";
import { Config } from "@interfaces/config";
import { Router } from "@angular/router";

/** This class is injected into many other classes. Those classes are dependent of this one. */
@Injectable({
  providedIn: "root",
})
export class GlobalService {
  /** In charge of page loading. */
  loading: HTMLIonLoadingElement;
  public static translate: TranslateService;
  public static Global: GlobalService;
  constructor(private nav: NavController, private load: LoadingController, private translate: TranslateService, private router: Router) {
    GlobalService.translate = this.translate;
    GlobalService.Global = this;
    GlobalService.Config.client = this.getStorage("currentClient");
    GlobalService.Config.station = this.getStorage("currentStation");
    GlobalService.Config.isMultiClient = this.getStorage("isMultiClient");
    if (!GlobalService.Config.zone) GlobalService.Config.zone = this.getStorage("currentZone");
  }

  /** Contains information from Config. */
  public static Config: Config = {
    station: undefined,
    zone: undefined,
    client: undefined,
    isMultiClient: false,
    parkSettings: undefined,
  };

  /** Loads loading page. */
  async simpleLoading() {
    this.loading = await this.load.create({
      spinner: null,
      cssClass: "spinner-carface",
      duration: 8000,
    });
    await this.loading.present();
  }

  /** Closes loading page. */
  async cancelLoad() {
    await this.loading?.dismiss();
  }

  /** Opens a new page and closes all previously open pages.
   * @param route string containing the route to the page. */
  navToRoot(route) {
    this.nav.navigateRoot(route);
  }

  /** Opens a new page after the other the user is currently in.
   * @param url string containing the route to the page. */
  goTo(url) {
    this.nav.navigateForward(url);
  }

  /** Checks if the current date is different from the date in the database.
   * @returns true if the date is the same, false if it is different. */
  checkDay() {
    return new Date().getDate() == this.getStorage("dayToday") || 0 ? true : false;
  }

  /** Updates the date in the database. */
  newDay() {
    this.setStorage("dayToday", new Date().getDate());
    return [];
  }

  /** Replaces the first char of each word in a string with its upper case counterpart.
   * @param value string to be converted.
   * @returns resulting string. */
  toUpperEachWord(value: string) {
    return value.replace(/(^\w|\s\w)/g, (m: any) => m.toUpperCase());
  }

  /** Checks if the license plate given is valid or not.
   * @param plate string to be checked.
   * @returns plate string if it's a valid plate. */
  validatePlate(plate: string): string {
    // If there's a '-' in the plate, it's 8 chars long and it's a portuguese plate
    if (plate.match("-") && plate.length == 8 && this.isHasLetterAndNumber(plate)) {
      return plate;
      // If it's 6 chars long and it's a portuguese plate, add the '-'
    } else if (plate.length == 6 && this.isHasLetterAndNumber(plate)) {
      plate = plate.toUpperCase().substr(0, 2) + "-" + plate.toUpperCase().substr(2, 2) + "-" + plate.toUpperCase().substr(4, 5);
      return plate;
    }
    // Sixt QRcodes
    if (plate.length > 50 && plate.match("|")) {
      Alert.simpleToast("global.toast.sixtQR");
      let res = plate.split("|", 2);
      plate = res[1];
      return this.validatePlate(plate);
    }
    // If plate exists but no other conditions were met, then it's an invalid plate
    if (plate) Alert.simpleToast("global.toast.invalidPlate");
    return "";
  }

  /** Checks if the given string has numbers and letters.
   * @param str string to be checked.
   * @returns true if it has numbers and letters, false if it doesn't. */
  public isHasLetterAndNumber(str) {
    if (!/^\d+$/.test(str) && !/^[a-zA-Z]+$/.test(str)) return true;
    else return false;
  }

  /////////////******* STORAGE ********/////////////

  /** Updates information related to "key" by replacing it with information from "value".
   *
   * If value is a string, it will be stored right away. Else, it will be converted to string and then stored.
   * @param key keyword associated with information to be updated in storage.
   * @param value information to be stored. */
  setStorage(key: string, value: any) {
    if (typeof value == "string") localStorage.setItem(key, value);
    else {
      localStorage.setItem(key, JSON.stringify(value));
    }
  }

  /** Gets information related to "key" from storage.
   * @param key keyword associated with information to be retrieved from storage.
   * @returns information. */
  getStorage(key: string) {
    const value = localStorage.getItem(key);
    try {
      return JSON.parse(value);
    } catch (error) {
      return value;
    }
  }

  public resetStorage(key: string) {
    localStorage.removeItem(key);
  }


  /** Clean All Storage Data */
  public cleanStorage() {
    localStorage.clear();
  }

  /** Creates an object containing a list with the properties to be displayed in the home page, for each
   * service available to the user.
   * @param service array of strings containing the services available to the user.
   * @returns object created. */
  // public getHomeServices(service: string[]) {
  //   let obj: {
  //     size: string;
  //     title: string;
  //     icon: string;
  //     color: string;
  //     page?: string;
  //     dataCy?: string;
  //     class?: string;
  //   }[] = [];
  //   if (service.includes("Transferes"))
  //     obj.push({
  //       size: "6",
  //       title: "ola",
  //       icon: "car",
  //       color: "mov",
  //       page: "mov",
  //       dataCy: "card-transfer",
  //     });
  //   if (service.includes("Abastecimentos"))
  //     obj.push({
  //       size: "6",
  //       title: "Abastecimentos",
  //       icon: "../../assets/icon/abast.svg",
  //       color: "danger",
  //       page: "abastecimento",
  //       dataCy: "card-fuel",
  //     });
  //   if (service.includes("Meus Ganhos"))
  //     obj.push({
  //       size: "6",
  //       title: "Meus Ganhos",
  //       icon: "stats-chart",
  //       color: "ganhos",
  //       page: "ganhos",
  //       dataCy: "card-rendimento",
  //     });
  //   if (service.includes("Ajuda"))
  //     obj.push({
  //       size: "6",
  //       title: "Ajuda",
  //       icon: "information-circle",
  //       color: "ajuda",
  //       page: "ajuda",
  //       class: "flag_new",
  //     });
  //   if (service.includes("Recibos Verdes"))
  //     obj.push({
  //       size: "6",
  //       title: "Recibos Verdes",
  //       icon: "card",
  //       color: "recibos",
  //       page: "recibos",
  //     });
  //   if (service.includes("Horários"))
  //     obj.push({
  //       size: "6",
  //       title: "Horários",
  //       icon: "time",
  //       color: "horarios",
  //       class: "disabled",
  //     });
  //   return obj;
  // }
}
