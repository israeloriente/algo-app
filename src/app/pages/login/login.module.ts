import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule } from "@angular/forms";
import { Routes, RouterModule } from "@angular/router";

import { IonicModule } from "@ionic/angular";

import { LoginPage } from "./login.page";
import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";

const routes: Routes = [
  {
    path: "",
    component: LoginPage,
  },
];

@NgModule({
  imports: [CommonModule, IonicModule, ReactiveFormsModule, RouterModule.forChild(routes)],
  declarations: [LoginPage],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class LoginPageModule {}
