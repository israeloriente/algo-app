import { Component, ViewChild } from "@angular/core";
import { GlobalService } from "../../../services/global.service";
import { Alert } from "src/app/class/core/Alert";
import { OnValidation, Service } from "src/app/class/services/Service";
import { KeyboardComponent } from "../input-keyboard/input-keyboard.component";
import { InjectableService } from "@src/app/decorators/InjectableService";

@Component({
  selector: "app-input-plate",
  templateUrl: "./input-plate.component.html",
  styleUrls: ["./input-plate.component.scss"],
})
export class InputPlateComponent implements OnValidation {
  service: Service;

  @ViewChild("keyboard_component", { static: true }) keyboard_component!: KeyboardComponent;

  constructor(public controller: InjectableService, private global: GlobalService) {
    this.service = controller.service;
    controller.addOnValidation(this);
    controller.updateProperty("Plate", "Station", "Client", "Zona", "MatriculaEstrangeira", "ScannerType");
    if (this.controller.status == "new") controller.updateProperty("created");
  }

  get isValid(): boolean {
    const plateLength = this.service.IsForeignPlate ? 7 : 8;
    return this.service.Plate.length >= plateLength;
  }

  /** Changes keyboard. */
  modeEv() {
    this.keyboard_component.onToggleKeyboard();
  }

  /** Clears license plate variable.
   * Used if operator wants to change from portuguese type to foreign.
   */
  mudouMatriculaEstrangeira() {
    this.service.IsForeignPlate = !this.service.IsForeignPlate;
    if (!this.service.Id) {
      this.service.Plate = "";
    }
  }

  /** Receives char selected by operator on keyboard and adds it to plate string.
   *
   * Checks if it's a foreign or portuguese plate and checks if it's valid.
   *
   * @bug If plate.length % 2 != 0 && char == '-', switches to other keyboard. This is a minor bug.
   *
   * @bug If 6th char == '-', it will show an alert and erase it but it will go to the next slide,
   *  without allowing for item to be finished. This is a minor bug.
   * @param char char in button selected by operator.
   */
  setChar(char) {
    if (char == "ABC" || char == "123") return;
    if (char == "delete") {
      this.delChar();
      return;
    }
    const plate = (this.service.Plate += char);
    var serviceID = plate;
    // Foreign license plate
    if (this.service.IsForeignPlate) {
      if (plate.length > 9) {
        // Validation
        this.service.Plate = serviceID.substr(0, serviceID.length - 1);
        Alert.simpleAlert("global.simpleAlert.tooManyChars");
      }
      // Portuguese license plate
    } else {
      // Changes keyboard every 2 chars
      if (plate.length % 2 == 0 && plate.length < 6) this.modeEv();
      // Checks for '-'
      if (serviceID.substr(serviceID.length - 1) === "-") {
        // Erases '-'
        this.service.Plate = serviceID.substr(0, serviceID.length - 1);
        Alert.simpleAlert("global.simpleAlert.separator");
      }
      if (serviceID.length == 6 && this.global.isHasLetterAndNumber(plate)) {
        // Valid portuguese license plate
        this.KeyboardResponse(this.service);
      } else if (serviceID.length > 6) {
        this.service.Plate = serviceID.substr(0, serviceID.length - 1);
        Alert.simpleToast("global.toast.setChar");
      } else if (serviceID.length > 5) Alert.simpleAlert("global.simpleAlert.validPlate");
    }
  }

  async KeyboardResponse(value: Service) {
    this.service.Plate = this.global.validatePlate(value.Plate);
    this.controller.slideNext();
  }

  /** Deletes all the '-' and then deletes the last letter from the license plate. - quando se clica no botao de delete */
  delChar() {
    if (!this.service.IsForeignPlate) {
      this.service.Plate = this.service.Plate.replace("-", "");
      this.service.Plate = this.service.Plate.replace("-", "");
    }
    this.service.Plate = this.service.Plate.slice(0, -1);
  }

  setLastService() {
    this.service.Plate = Service.lastCarUsed.Plate;
    this.controller.slideNext();
  }

  /** Returns the vehicle's license plate.
   * @returns license plate string.
   */
  get getPlate() {
    return this.service.Plate || "";
  }
  get hasLastService() {
    return Service.lastCarUsed?.Plate != null;
  }
}
