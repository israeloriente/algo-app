import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { IonicModule } from "@ionic/angular";
import { FormsModule } from "@angular/forms";
import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { ListServicesComponent } from "./list-services/list-services.component";
import { InputPlateComponent } from "./add-modal/input-plate/input-plate.component";
import { KeyboardComponent } from "./add-modal/input-keyboard/input-keyboard.component";
import { InputPhotoComponent } from "./add-modal/input-photo/input-photo.component";
import { InputFuelComponent } from "./add-modal/input-fuel/input-fuel.component";
import { InputKmComponent } from "./add-modal/input-km/input-km.component";
import { FinishingComponent } from "./add-modal/finishing/finishing.component";
import { InputLitroComponent } from "./add-modal/input-litro/input-litro.component";
import { InputDescriptionComponent } from "./add-modal/input-description/input-description.component";
import { InputTypeFuel } from "./add-modal/input-type-fuel/input-type-fuel.component";
import { InputAccessoryComponent } from "./add-modal/input-accessory/input-accessory.component";
import { OriginDestinyTransferComponent } from "./add-modal/origin-destiny-transfer/origin-destiny-transfer.component";
import { InputTypeServiceComponent } from "./add-modal/input-type-service/input-type-service.component";
import { InputParkComponent } from "./add-modal/input-park/input-park.component";
import { InputInfoComponent } from "./add-modal/input-info/input-info.component";
import { SelectClientComponent } from "./add-modal/select-client/select-client.component";
import { StopWatchComponent } from "./add-modal/stop-watch/stop-watch.component";
import { InputSpecialServiceTypeComponent } from "./add-modal/input-special-service-type/input-special-service-type.component";
import { InputParkListComponent } from "./add-modal/input-park-list/input-park-list.component";

@NgModule({
  declarations: [
    ListServicesComponent,
    // Modals components
    InputPlateComponent,
    InputLitroComponent,
    KeyboardComponent,
    InputPhotoComponent,
    InputFuelComponent,
    InputInfoComponent,
    InputKmComponent,
    FinishingComponent,
    StopWatchComponent,
    InputDescriptionComponent,
    InputTypeFuel,
    InputAccessoryComponent,
    OriginDestinyTransferComponent,
    InputTypeServiceComponent,
    InputParkComponent,
    InputParkListComponent,
    SelectClientComponent,
    InputSpecialServiceTypeComponent,
    // end modals components
  ],
  imports: [IonicModule, CommonModule, FormsModule],
  exports: [
    CommonModule,
    IonicModule,
    FormsModule,
    ListServicesComponent,
    // Modals components
    InputPlateComponent,
    InputLitroComponent,
    KeyboardComponent,
    InputPhotoComponent,
    InputFuelComponent,
    InputInfoComponent,
    InputKmComponent,
    FinishingComponent,
    StopWatchComponent,
    InputDescriptionComponent,
    InputTypeFuel,
    SelectClientComponent,
    InputSpecialServiceTypeComponent,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class GeneralComponentsModule {}
