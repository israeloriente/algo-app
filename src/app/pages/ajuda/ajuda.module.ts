import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

import { IonicModule } from "@ionic/angular";

import { AjudaPageRoutingModule } from "./ajuda-routing.module";

import { AjudaPage } from "./ajuda.page";
import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, AjudaPageRoutingModule],
  declarations: [AjudaPage],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AjudaPageModule {}
