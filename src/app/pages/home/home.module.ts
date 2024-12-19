import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { IonicModule } from "@ionic/angular";
import { RouterModule } from "@angular/router";
import { HomePage } from "./home.page";
import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { SelectStationComponent } from "@src/app/components";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild([
      {
        path: "",
        component: HomePage,
      },
    ]),
    ReactiveFormsModule,
  ],
  declarations: [HomePage, SelectStationComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class HomePageModule {
}
