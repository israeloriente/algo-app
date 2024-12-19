import { AlertController, ToastController } from "@ionic/angular";
import { GlobalService } from "src/app/services/global.service";

/** Interface used in GlobalService.
 * @member {string} title is the title of the alert.
 * @member {string} message is the message of the alert.
 * @member {string} cancel is the text of the "cancel" button.
 * @member {string} ok is the text of the "ok" button. */
export interface ConfirmAlert {
  title: string;
  message: string;
  cancel: string;
  ok: string;
}

export interface simpleToast {
  message: string;
  time: number;
}

export interface simpleAlert {
  header: string;
  message: string;
}

/** It creates an alert with the error message and if
 * one alert opens, it closes it and opens a new one. */
export class Alert {
  private static alert: HTMLIonAlertElement = null;
  private static alertController = new AlertController();
  private static toast = new ToastController();

  /** Creates an alert with the error message.
   * @param route Translation directory route.
   * @param args (Optional) Any extra information to show in the alert.
   * @example simpleAlert("global.alerts.error", [err.message, err.code])
   * @returns Promise when the alert is closed. */
  static async simpleAlert(route: string, ...args: string[]) {
    let translation: simpleAlert = GlobalService.translate.instant(route);
    const message = translation.message.replace(/\$\{\}/g, () => {
      return args.shift() || "";
    });
    const alert = await Alert.alertController.create({
      header: translation.header,
      message,
      mode: "ios",
      buttons: ["Ok"],
    });
    if (Alert.alert != null) Alert.alert.dismiss();
    Alert.alert = alert;
    await alert.present();
    return await alert.onWillDismiss().finally(() => (Alert.alert = null));
  }

  /** Creates a toast (nonblocking notification pop-up).
   * @param route Translation directory route.
   * @param extra (Optional) Any extra information to show in the toast. */
  static async simpleToast(route: string, extra?: string) {
    let translation: simpleToast = GlobalService.translate.instant(route);
    const toast = await this.toast.create({
      message: translation.message + (extra ? extra + "!" : ""),
      position: "bottom",
      duration: translation.time,
    });
    toast.present();
  }

  /** Creates a toast (nonblocking notification pop-up).
   * @param route Translation directory route.
   * @param extra (Optional) Any extra information to show in the toast. */
  static async simpleToastArgs(route: string, ...args: string[]) {
    let translation: simpleToast = GlobalService.translate.instant(route);
    const message = translation.message.replace(/\$\{\}/g, () => {
      return args.shift() || "";
    });
    const toast = await this.toast.create({
      message: message,
      position: "bottom",
      duration: translation.time,
    });
    toast.present();
  }

  /** Custom Confirm Alert.
   * @param route translation directory route.
   * @example global.confirmAlert.ignoredAccessory
   * @returns Boolean response. */
  static async confirmAlert(route: string) {
    let response: boolean;
    let translation: ConfirmAlert = GlobalService.translate.instant(route);
    const alert = await this.alertController.create({
      cssClass: "alertColor",
      mode: "ios",
      header: translation.title,
      message: translation.message,
      buttons: [
        {
          text: translation.cancel || "Cancel",
          handler: () => {
            response = false;
          },
        },
        {
          text: translation.ok || "OK",
          handler: () => {
            response = true;
          },
        },
      ],
    });
    if (Alert.alert != null) Alert.alert.dismiss();
    Alert.alert = alert;
    await alert.present();
    await alert.onWillDismiss().finally(() => (Alert.alert = null));
    return response;
  }
}
