import { Injectable } from "@angular/core";
import { Platform } from "@ionic/angular";
import { environment } from "@root/environment";
import { NgxImageCompressService } from "ngx-image-compress";

/** Component in charge of the various services used throughout the app. */
@Injectable({
  providedIn: "root",
})
export class DeviceService {
  constructor(private platform: Platform, private imageCompress: NgxImageCompressService) {}

  /**
   * @deprecated since version 3.4.0.
   */
  async hideKeyboard() {}

  /** Retrieves App version.
   * @returns App version. If there is an error, returns the version defined in the environment file. */
  async getAppVersion() {
    return environment.VERSION;
  }

  async getBuildMode() {
    return environment.staging ? "STAGING" : environment.production ? "" : "DEV";
  }

  /** Convert base64 to type File.
   * @param base64 Data string.
   * @param filename Name of file.
   * @param type Type of file.
   * @returns New file.
   * @deprecated Not using since >=v3.8.
   */
  async convertBase64IntoFile(base64: any, file: File) {
    const res = await fetch(base64);
    const buf = await res.arrayBuffer();
    return new File([buf], file.name, { type: file.type });
  }

  /** Checks if the device is running Android by comparing the given string to a list of strings.
   * @returns True if the device is running Android, false otherwise. */
  get isAndroid() {
    return this.platform.is("android");
  }

  /** Checks if the device is running iOS by comparing the given string to a list of strings.
   * @returns True if the device is running iOS, false otherwise. */
  get isIos() {
    return this.platform.is("ios");
  }

  /** Checks if the device is a desktop by comparing the given string to a list of strings.
   * @returns True if the device is a desktop, false otherwise. */
  get isDesktop() {
    return this.platform.is("desktop");
  }

  /** Checks if the app is a PWA (Progressive Web App) by comparing the given string to a list of strings.
   * @returns True if the app is a PWA, false otherwise. */
  get isPwa() {
    return this.platform.is("pwa");
  }

  /** Checks if the device is running Capacitor by comparing the given string to a list of strings.
   * @returns True if the device is running Capacitor, false otherwise. */
  get isCapacitor() {
    return this.platform.is("capacitor");
  }
}
