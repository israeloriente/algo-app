import { environment } from "@root/environment";
import { Alert } from "./core/Alert";
import { DnnCore } from "../services/dnn.core.service";
import axios from "axios";

/**
 * Class to validate and report to parse Logs class.
 * The user will be notified of the validated error.
 * @extends Alert
 */
export class Report {
  constructor(public errorMessage: { message: string }, public route: string, isAlert: boolean = true) {
    const msgValidated = this.erroValidators(this.errorMessage, this.route);
    if (isAlert) Alert.simpleAlert("global.simpleAlert.report", msgValidated);
  }

  /**
   * Sends an error log to the server.
   * @param error - The error that was thrown.
   * @param route - The route where the error occurred.
   */
  public static async sendLog(error: string, route: string) {
    try {
      const response = await axios.post(
        `${environment.dnnPortalUrl}/DeskTopModules/Newface/API/Report/Create`,
        {
          Message: error,
          Route: route,
          Version: environment.VERSION,
        },
        {
          headers: {
            ...DnnCore.Authentication.getAuthorizationHeader(),
            "Content-Type": "application/json",
          },
        }
      );

      // If you need to handle the response data
      let data = response.data;
    } catch (err) {
      if (route != "class.Report.sendLog") {
        new Report(err, "class.Report.sendLog", false);
      }
    }
  }

  /**
   * It takes an error and the route where the error was generated, and returns a string.
   * @param error - The error message that was thrown.
   * @param route - The route where the error occurred.
   * @returns The error message validated.
   */
  private erroValidators(error: { message: string }, route: string): string {
    if (!environment.production) console.log(error);
    switch (error?.message) {
      case `XMLHttpRequest failed: "Unable to connect to the Parse API"`:
        return "Sem conexão com a internet";
      case "Duplicate request":
        return "Informação já registrada";
      case "Permission denied, user needs to be authenticated.":
      case "Invalid session token":
        return `Sem autenticação, faça login novamente`;
      case "Failed to fetch":
        return "Não está com acesso à  Internet";
      case "Request failed with status code 504":
        return "Sem acesso à Internet";
      case "Deprecated Version":
        Report.sendLog(error.message, route);
        return `Você está usando uma versão desatualizada do aplicativo,
        atualize-o fechando e abrindo a app para garantir um bom funcionamento.`;
      default:
        Report.sendLog(error.message, route);
        return error?.message;
    }
  }

  /** Checks the error message to see if it contains the string "Not implemented on web".
   * If it does, then the error will be ignored and not sent to the server.
   * @param error The error message that was thrown.
   * @returns True if the error message contains the string "Not implemented on web". */
  static ignoreError(error: string) {
    return error.includes("Not implemented on web");
  }
}
