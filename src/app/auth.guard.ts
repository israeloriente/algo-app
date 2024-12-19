import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";
import { DnnCore } from "./services/dnn.core.service";

@Injectable({
  providedIn: "root",
})
export class AuthGuard {

  async canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {

    if (await DnnCore.Authentication.isUserAuthenticated()) {
      return true;
    }
    else {
      DnnCore.Authentication.logout();
      return false;
    }
  }

}
