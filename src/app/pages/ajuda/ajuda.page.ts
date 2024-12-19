import { Component} from "@angular/core";

@Component({
  selector: "app-ajuda",
  templateUrl: "./ajuda.page.html",
  styleUrls: ["./ajuda.page.scss"],
})
export class AjudaPage {
  public modalType = "";

  constructor() {}
  
  public setOpenModal(modalType: string = "") {
      this.modalType = modalType;
  }

}

