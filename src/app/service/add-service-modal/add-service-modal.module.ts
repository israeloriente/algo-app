import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { IonicModule } from "@ionic/angular";
import { AddServiceModal } from "./add-service.modal";
import { PreviewComponent } from "@src/app/components/add-modal/preview/preview.component";


@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, ReactiveFormsModule],
  declarations: [
    AddServiceModal,
    PreviewComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AddServiceModalPageModule { }
