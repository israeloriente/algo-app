import { NgModule } from "@angular/core";
import { MatButtonToggleModule } from "@angular/material/button-toggle";
import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";

@NgModule({
  exports: [MatButtonToggleModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class MaterialModule {

}

