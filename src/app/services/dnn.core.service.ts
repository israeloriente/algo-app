import { Injectable } from "@angular/core";
import * as dnn from "@interfaces/dnnClasses";
import { Constants } from "@root/constants";
import { GlobalService } from "./global.service";
import axios from "axios";

export namespace DnnCore {
  @Injectable({
    providedIn: "root",
  })
  export class Authentication {
    constructor(private global: GlobalService) {}

    public static getAuthorizationHeader() {
      const token = localStorage.getItem("access_token");
      if (token) {
        return {
          Authorization: `Bearer ${token}`,
        };
      }
      return {};
    }

    /** Authenticates the user based on the information on database.
     * @param username Username of the user.
     * @param password Password of the user.
     * @returns Promise. */
    async login(username: string, password: string): Promise<dnn.User> {
      try {
        const response = await axios.post(
          Constants.apiAuthorizationLogin,
          {
            u: username.toLowerCase(),
            p: password,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (response.status !== 200) {
          return null;
        } else {
          const data = response.data;
          localStorage.setItem("access_token", data.AccessToken);
          localStorage.setItem("renewal_token", data.RenewalToken);
          return data.UserProfile;
        }
      } catch (error) {
        console.error("Error performing user login:", error);
        return null;
      } finally {
        this.global.cancelLoad();
      }
    }

    /** Check if the user account is locked out.
     * @param username Username of the user.
     * @returns Promise. */
    async isLockedOut(username: string): Promise<boolean> {
      try {
        const response = await axios.post(
          Constants.apiAuthorizationIsLockedOut,
          {
            u: username.toLowerCase(),
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        if (response.status !== 200) {
          console.error(`Failed to check lock status for user ${username}. Status: ${response.status}`);
          return false;
        }
        return typeof response.data === "boolean" ? response.data : false;
      } catch (error) {
        console.error(`Error checking lock status for user ${username}:`, error);
        return false;
      }
    }

    async isValidUser(username: string): Promise<boolean> {
      try {
        const response = await axios.post(
          Constants.apiAuthorizationIsValidUser,
          {
            u: username.toLowerCase(),
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        if (response.status !== 200) {
          console.error(`Failed to check lock status for user ${username}. Status: ${response.status}`);
          return false;
        }
        return typeof response.data === "boolean" ? response.data : false;
      } catch (error) {
        console.error(`Error checking lock status for user ${username}:`, error);
        return false;
      }
    }

    /**
     * If the access token is invalid try to issue a new one using the renewal token.
     * @returns true or false depending on the extending the token with success.
     */
    static async extendToken() {
      try {
        let rToken = localStorage.getItem("renewal_token");
        if (rToken == null) return false;

        const response = await axios.post(
          Constants.apiAuthorizationExtendToken,
          {
            rtoken: rToken,
          },
          {
            headers: {
              "Content-Type": "application/json",
              ...Authentication.getAuthorizationHeader(),
            },
          }
        );
        if (response.status !== 200) {
          console.error("Failed to extend token");
          return false;
        }
        const data = response.data;
        localStorage.setItem("access_token", data.AccessToken);
        localStorage.setItem("renewal_token", data.RenewalToken);
        return true;
      } catch (error) {
        //console.error("Error extending token", error);
        return false;
      }
    }

    static async logout() {
      GlobalService.Global.navToRoot("/login");
      GlobalService.Global.resetStorage("access_token");
      GlobalService.Global.resetStorage("renewal_token");
    }

    static async getCurrentUser() {
      const response = await axios.get(Constants.apiAuthorizationGetCurrentUser, {
        headers: Authentication.getAuthorizationHeader(),
      });
      return response.data;
    }

    protected static async isAuthenticated(): Promise<boolean> {
      try {
        const res = await axios.get(Constants.apiAuthorizationIsAuthenticated, {
          headers: Authentication.getAuthorizationHeader(),
        });

        const result = res.data;
        return typeof result === "boolean" ? result : false;
      } catch (error) {
        //console.error("Error checking user is authenticated", error);
        return false;
      }
    }

    static async isUserAuthenticated(): Promise<boolean> {
      try {
        if (!(await Authentication.isAuthenticated())) {
          if (await Authentication.extendToken()) {
            let isAuth = await Authentication.isAuthenticated();
            if (!isAuth) DnnCore.Authentication.logout();
            return isAuth;
          }
        }

        return true;
      } catch (error) {
        console.error("Error checking user authentication:", error);
        return false;
      }
    }

    async sendResetPasswordCode(username: string) {
      const response = await axios.post(
        Constants.apiAuthorizationSendResetPasswordCode,
        {
          u: username.toLowerCase(),
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      return response;
    }

    async isResetPasswordCodeValid(username: string, resetCode: string) {
      const response = await axios.post(
        Constants.apiAuthorizationIsResetPasswordCodeValid,
        {
          u: username.toLowerCase(),
          c: resetCode,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      return response;
    }

    async updatePassword(username: string, resetCode: string, password1: string, password2: string) {
      const response = await axios.post(
        Constants.apiAuthorizationUpdatePassword,
        {
          u: username.toLowerCase(),
          c: resetCode,
          p1: password1,
          p2: password2,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      return response;
    }
  }
}
