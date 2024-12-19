import { Component } from "@angular/core";
import { MenuController, Platform } from "@ionic/angular";
import { GlobalService } from "./services/global.service";
import { DeviceService } from "./services/device.service";
import { environment } from "@root/environment";
import { TranslateService } from "@ngx-translate/core";
import { Alert } from "./class/core/Alert";
import { register } from "swiper/element/bundle";
import { DnnCore } from "./services/dnn.core.service";
import { Station, User } from "@interfaces/dnnClasses";
import { AWSS3Service } from "./services/aws.service";
import { SwUpdate } from "@angular/service-worker";

/** App component. */
register();
@Component({
  selector: "app-root",
  templateUrl: "app.component.html",
  styleUrls: ["app.component.scss"],
})
export class AppComponent {
  public installButtonPwaAndroid;
  /** If true, app is in debug mode. */
  public isDebug: boolean = false;
  /** If true, app is in staging mode.*/
  public isStaging: boolean = false;
  /** Version of the app currently installed. */
  public versionApp: string;
  /** Contains information from User. */
  public static User: User = {
    Id: 0,
    DisplayName: "",
    Username: "",
    MobileNumber: "",
    Email: "",
    UserProfileType: undefined,
    Zone: undefined,
  };
  /** Array containing a list of stations. */
  private Stations: Station[];
  /** @bug not used. */
  public appPages = [];

  constructor(
    private platform: Platform,
    public authentication: DnnCore.Authentication,
    public global: GlobalService,
    public menu: MenuController,
    public device: DeviceService,
    private translate: TranslateService,
    private swUpdate: SwUpdate
  ) {
    this.initializeApp();
    this.initTranslate();
    this.detectInternetSignal();
  }

  /** Called when initializing the app. */
  private initializeApp() {
    // this.authentication.logout();
    console.log("initializeApp");
    this.platform.ready().then(async () => {
      // If the app is running as a PWA app
      // Verify updates
      if (this.swUpdate.versionUpdates) {
        this.swUpdate.versionUpdates.subscribe(async (event) => {
          if (event.type == "VERSION_READY") {
            Alert.simpleToast("global.toast.initializeApp");
            document.location.reload();
          }
        });
      }
      // Prevents from installing the app again
      window.addEventListener("beforeinstallprompt", (e) => {
        e.preventDefault();
        this.installButtonPwaAndroid = e;
      });
      // If the app is running as a PWA, initialize app
      // if (window.matchMedia("(display-mode: standalone)").matches) {
      await DnnCore.Authentication.isUserAuthenticated(); // this call is to ensure that we have a valid access token
      let currentUser: User = await DnnCore.Authentication.getCurrentUser();
      // If the user is logged in
      if (currentUser) {
        await this.initializeVariables(currentUser);
      } else {
        this.logout(); //false);
      }
      this.isDebug = !environment.production && !environment.staging;
      this.isStaging = environment.staging;
      this.menu.enable(true);
      // If we're viewing the app in a browser (NOT PWA)
      // }
    });
  }

  protected logout() {
    DnnCore.Authentication.logout();
  }

  /** Init ngx-translate to minimize height alerts. */
  private async initTranslate() {
    this.translate.setDefaultLang(environment.defaultLanguage);
  }

  /** Loads information related to user.
   * @param currentUser Information about user currently logged in. */
  async initializeVariables(currentUser: User) {
    if (currentUser == null) return;

    this.menu.enable(true);
    AppComponent.User = currentUser;
    AWSS3Service.initialize();
    // this.Config.parseAppVersionUpdate = await this.configuration.getVersion(); //this.parse.getParseConfig("version");
    this.versionApp = await this.device.getAppVersion();
    //console.log("initializeVariables", currentUser);
    if (currentUser.Zone) GlobalService.Config.zone = { ...currentUser.Zone, Label: currentUser.Zone.Name, Description: "" };
    this.global.navToRoot("home");
  }

  /** Syncronizes all data from the app. */
  async sync() {
    await this.global.simpleLoading();
    this.menu.close();
    AppComponent.User = await DnnCore.Authentication.getCurrentUser();
    if (AppComponent.User.Zone && AppComponent.User.Zone.Id != GlobalService.Config.zone.Id) {
      GlobalService.Config.zone = { ...AppComponent.User.Zone, Label: AppComponent.User.Zone.Name, Description: "" };
      GlobalService.Global.setStorage("currentZone", GlobalService.Config.zone);
      GlobalService.Config.station = undefined;
    }
    // this.Config.parseAppVersionUpdate = await this.configuration.getValue("Version"); //this.parse.getParseConfig("version");
    this.versionApp = await this.device.getAppVersion();
    //this.Stations = await this.parse.getStations(true, [...[], this.getZone.id]);
    // if (this.Config.station) {
    //   this.Stations.forEach((item) => {
    //     if (item.id == this.Config.station.id) this.Config.station = item;
    //   });
    // }
    Alert.simpleToast("global.toast.sync");
    await this.global.cancelLoad();
  }

  updateApp() {
    document.location.reload();
  }

  detectInternetSignal() {
    window.addEventListener("online", async () => Alert.simpleToast("global.toast.online"));
    window.addEventListener("offline", () => Alert.simpleToast("global.toast.offline"));
  }

  /** Retrieves information on the current user's zone.
   * @returns Information on the current user's zone. */
  get getZone() {
    return AppComponent.User.Zone;
  }

  /** Retrieves an array containing a list of stations.
   * @returns Array containing a list of stations. */
  get getStations() {
    return this.Stations;
  }

  /** Retrieves information on a specific station.
   * @returns Information on a specific station. */
  get getStation() {
    return GlobalService.Config.station;
  }

  /** Retrieves information on the current user.
   * @returns Information on the current user. */
  get getUser(): User {
    return AppComponent.User;
  }

  /** @bug not used -> check origin-destiny.component.html
   * @returns  */
  get getPlaces() {
    return this.Stations;
  }

  /** Retrieves an array contaning a list of movs.
   * @returns Array contaning a list of movs. */
  // get getMovs() {
  //   // return this.Config.movs;
  // }

  /** Retrieves an array contaning a list of abs.
   * @returns Array contaning a list of abs. */
  // get getAbs() {
  //   return this.Config.abs;
  // }

  /** Retrieves information about the last successfull mov.
   * @returns Information about the last successfull mov. */
  // get getMovsLastMov() {
  //   return this.Config.movs[0];
  // }

  /** Checks if the station exists.
   * @returns True if the station exists, false otherwise. */
  get stationIsValid() {
    return GlobalService.Config?.station ? true : false;
  }
}
