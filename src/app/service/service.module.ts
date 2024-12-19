import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

import { IonicModule } from "@ionic/angular";

import { ServicePageRoutingModule } from "./service-routing.module";

import { ServicePage } from "./service.page";
import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { GeneralComponentsModule } from "../components/general-components.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ServicePageRoutingModule,
    GeneralComponentsModule
  ],
  declarations: [ServicePage],
  schemas: [CUSTOM_ELEMENTS_SCHEMA,],
})
export class ServicePageModule {
  // static services = [Washed, Movement2];
}
