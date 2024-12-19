import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { ServicePage } from "./service.page";
import { AuthGuard } from "../auth.guard";

const routes: Routes = [
  {
    path: "",
    component: ServicePage,
    canActivate: [AuthGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ServicePageRoutingModule {
  constructor() {}
}
