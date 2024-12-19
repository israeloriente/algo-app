import { Injectable } from "@angular/core";
import * as dnn from "@interfaces/dnnClasses";
import { DnnCore } from "./dnn.core.service";
import { Constants } from "@root/constants";
import { environment } from "@root/environment";
import { Service } from "../class/services/Service";
import { LookupItem } from "@interfaces/dnnClasses";
import { moment } from "./momentjs.service";
import { AppComponent } from "../app.component";
import axios from "axios";
import { Report } from "../class/Report";

export namespace DnnOperation {
  @Injectable({
    providedIn: "root",
  })
  export class DnnService {
    public static async getClients(): Promise<dnn.LookupItem[]> {
      const response = await axios.get(Constants.apiClientLookup + "?orderby=Label", {
        headers: DnnCore.Authentication.getAuthorizationHeader(),
      });
      return response.data || [];
    }

    public static async getStationClients(stationId: number): Promise<dnn.LookupItem[]> {
      const params = {
        id: stationId.toString(),
      };
      const response = await axios.get(Constants.apiStationLookupClients, {
        headers: DnnCore.Authentication.getAuthorizationHeader(),
        params,
      });
      return response.data || [];
    }

    public static async getZones(): Promise<dnn.LookupItem[]> {
      try {
        const response = await axios.get(`${Constants.apiZoneLookup}?orderby=Label`, {
          headers: DnnCore.Authentication.getAuthorizationHeader(),
        });
        return response.data || [];
      } catch (error) {
        return [];
      }
    }

    public static async getStations(clientId: number, zoneId: number, includeMultiClientStations: boolean): Promise<dnn.LookupItem[]> {
      try {
        await DnnCore.Authentication.isUserAuthenticated(); // ensure valid access token
        const params = {
          ClientId: clientId.toString(),
          ZoneId: zoneId.toString(),
          IncludeMultiClientStations: includeMultiClientStations ? "1" : "0",
        };
        const response = await axios.get(Constants.apiStationLookup, {
          headers: DnnCore.Authentication.getAuthorizationHeader(),
          params,
        });
        if (response.status === 401) throw new Error("Unauthorized");
        return response.status === 200 ? response.data : [];
      } catch (error) {
        new Report(error, "services.DnnOperation.DnnService.getStations");
        return [];
      }
    }

    public static async getStationsMultiClient(zoneId: number): Promise<dnn.LookupItem[]> {
      try {
        await DnnCore.Authentication.isUserAuthenticated();
        const params = {
          ZoneId: zoneId.toString(),
        };
        const response = await axios.get(Constants.apiStationLookupMultiClient, {
          headers: DnnCore.Authentication.getAuthorizationHeader(),
          params,
        });
        if (response.status === 401) throw new Error("Unauthorized");
        return response.status === 200 ? response.data : [];
      } catch (error) {
        new Report(error, "services.DnnOperation.DnnService.getStationsMultiClient");
        return [];
      }
    }

    public static async getTypeServiceStation(stationId: string): Promise<any> {
      try {
        const params = { id: stationId };
        const response = await axios.get(Constants.apiStationLookupByStation, {
          headers: DnnCore.Authentication.getAuthorizationHeader(),
          params,
        });

        return response.status === 200 ? response.data : [];
      } catch (error) {
        new Report(error, "services.DnnOperation.DnnService.getTypeServiceStation");
        return [];
      }
    }

    // TODO DELETE DEPOIS
    // public static async getTypesService(): Promise<LookupItem[]> {
    //   try {
    //     const response = await axios.get(Constants.apiServiceLookup, {
    //       headers: DnnCore.Authentication.getAuthorizationHeader(),
    //     });

    //     if (response.status === 200) {
    //       return response.data;
    //     } else {
    //       return [];
    //     }
    //   } catch (error) {
    //     new Report(error, "services.DnnOperation.DnnService.getTypesService");
    //     return []; // Retorna um array vazio em caso de erro
    //   }
    // }

    public static async getSpecialServiceTypes(): Promise<LookupItem[]> {
      try {
        const response = await axios.get(Constants.apiSpecialServiceTypeLookup, {
          headers: DnnCore.Authentication.getAuthorizationHeader(),
        });

        if (response.status === 200) {
          return response.data;
        } else {
          return [];
        }
      } catch (error) {
        new Report(error, "services.DnnOperation.DnnService.getTypesService");
        return []; // Retorna um array vazio em caso de erro
      }
    }

    public static async getServices<T, Service>(
      service: Service,
      filter: {
        stationId: number;
        showAll: boolean;
      }
    ): Promise<T[]> {
      let date = moment.getStart(new Date(), "day");
      const queryParams = {
        filters: `StationId:(eq)'${filter.stationId}',CreatedOnDate:(ge)'${date.toISOString()}'${
          filter.showAll ? "" : `,UserId:(eq)'${AppComponent.User.Id}'`
        }`,
        orderby: "-CreatedOnDate",
      };
      const queryString = new URLSearchParams(queryParams).toString();

      // @ts-ignore
      const tmp = new service();
      const baseUrl = environment.dnnPortalUrl + `/DeskTopModules/Carface.Rentals/API/${tmp.className}/ListExtended`;
      const url = `${baseUrl}?${queryString}`;

      await DnnCore.Authentication.isUserAuthenticated(); // ensure valid access token

      try {
        const response = await axios.get(url, {
          headers: DnnCore.Authentication.getAuthorizationHeader(),
        });

        if (response.status === 401) throw new Error("Unauthorized");

        const { Items } = response.data;
        const items = [];

        if (response.status === 200) {
          for (let i = 0; i < Items.length; i++) {
            // @ts-ignore
            const item = new service();
            const data = Items[i];
            for (const key in data) {
              if (key !== "Content") item[key] = data[key];
              else {
                for (const k in data[key]) {
                  if (k !== "Id") item[k] = data[key][k];
                }
              }
            }
            items.push(item);
          }
        }
        return items;
      } catch (error) {
        new Report(error, "services.DnnOperation.DnnService.getServices");
        return [];
      }
    }

    /**
     *
     * @param service Identification of the service to be created or updated
     * @param body data to be saved
     * @param maxAttempts attempts to recall the function in case of an error
     * @returns service new data
     */
    public static async createUpdate(service: Service, body: string, maxAttempts: number = 3): Promise<Service> {
      try {
        await DnnCore.Authentication.isUserAuthenticated(); // this call is to ensure that we have a valid access token
        const response = await axios.post(
          `${environment.dnnPortalUrl}/DeskTopModules/Carface.Rentals/API/${service.className}/CreateOrUpdatePartial`,
          body,
          {
            headers: {
              ...DnnCore.Authentication.getAuthorizationHeader(),
              "Content-Type": "application/json",
            },
          }
        );
        if (response.status === 200 || response.status === 201) {
          const data = response.data;
          const status = data["Status"];
          if (status !== service.Status && maxAttempts < 1) throw new Error("Different status than expected");
          if (data && data["Id"]) service.Id = data["Id"];
          if (data && data["CarId"]) service.CarId = data["CarId"];
        } else if (maxAttempts > 1) {
          await new Promise((resolve) => setTimeout(resolve, 1000));
          return await this.createUpdate(service, body, maxAttempts - 1);
        }
        return service;
      } catch (error) {
        if (error.response.status === 409) {
          throw new Error("DuplicatedPlate");
        } else if (error.response.status === 401) {
          throw new Error("Unauthorized");
        }
        throw error;
      }
    }

    public static async delete(service: Service): Promise<Service> {
      await DnnCore.Authentication.isUserAuthenticated(); // this call is to ensure that we have a valid access token
      const body = JSON.stringify(DnnService.stringifyObjectValues({ Id: service.Id, Plate: service.Plate }));
      try {
        const response = await axios.post(`${environment.dnnPortalUrl}/DeskTopModules/Carface.Rentals/API/${service.className}/Delete`, body, {
          headers: {
            ...DnnCore.Authentication.getAuthorizationHeader(),
            "Content-Type": "application/json",
          },
        });
        if (response.data && response.data["IsDeleted"] !== undefined) service.IsDeleted = response.data["IsDeleted"];
        return service;
      } catch (error) {
        return service;
      }
    }

    public static async stationsGetSettings(stationId: number): Promise<dnn.LookupItem[]> {
      try {
        await DnnCore.Authentication.isUserAuthenticated();
        const params = {
          id: stationId.toString(),
        };
        const response = await axios.get(Constants.apiStationGetSettings, {
          headers: DnnCore.Authentication.getAuthorizationHeader(),
          params,
        });
        if (response.status === 401) throw new Error("Unauthorized");
        return response.status === 200 ? response.data : [];
      } catch (error) {
        new Report(error, "services.DnnOperation.DnnService.stationsGetSettings");
        return [];
      }
    }

    private static stringifyObjectValues(obj: any): any {
      for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
          if (typeof obj[key] === "object" && obj[key] !== null) {
            obj[key] = JSON.stringify(obj[key]);
          }
        }
      }
      return obj;
    }
  }
}
