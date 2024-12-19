import { Component, Input, OnInit } from "@angular/core";
import { Service } from "src/app/class/services/Service";

export interface PreviewData {
  title: string;
  options?: { value_default?: any; row?: number };
  value: () => any;
}

@Component({
  selector: "app-preview",
  templateUrl: "./preview.component.html",
  styleUrls: ["./preview.component.scss"],
})
export class PreviewComponent implements OnInit {
  @Input() service: Service | any;
  @Input() data: { column_1: PreviewData[]; column_2: PreviewData[] };

  constructor() { }

  ngOnInit() {
    if (
      !this.data &&
      (this.service["__preview_data_Service"] ||
        this.service["__preview_data_" + this.service.constructor.name])
    ) {
      this.data = { column_1: [], column_2: [] };
      const serviceData = { column_1: [], column_2: [] };
      if (this.service["__preview_data_" + this.service.constructor.name]) {
        serviceData.column_1.push(
          ...this.service["__preview_data_" + this.service.constructor.name].column_1
        );
        serviceData.column_2.push(
          ...this.service["__preview_data_" + this.service.constructor.name].column_2
        );
      }
      if (this.service["__preview_data_Service"]) {
        serviceData.column_1.push(...this.service["__preview_data_Service"].column_1);
        serviceData.column_2.push(...this.service["__preview_data_Service"].column_2);
      }
      ["column_1", "column_2"].forEach((name) => {
        serviceData[name].forEach((element: { title: string; key: string; options: any }) =>
          this.data[name].push({
            title: element.title,
            value: () => this.elementValue(element),
            options: element.options,
          })
        );
      });
    }
    if (this.data?.column_1) this.data.column_1 = this.sortColumn(this.data.column_1);
    if (this.data?.column_2) this.data.column_2 = this.sortColumn(this.data.column_2);
  }

  private elementValue(element: { title: string; key: string; options: any }): any {
    let value = this.service[element.key]
      ? this.service[element.key]
      : element.options?.value_default;
    if (element?.options?.value) return element.options.value(value, this.service).toString();
    if (element?.options?.regex) {
      const match: RegExpExecArray | null = element?.options?.regex.exec(value.toString());
      value = match ? match[0] : value;
    }
    return value;
  }

  private sortColumn(data: PreviewData[]): PreviewData[] {
    const optionsRow: PreviewData[] = data.filter((element) => element?.options?.row != undefined);
    const optionsNoRow: PreviewData[] = data.filter(
      (element) => element?.options == undefined || element?.options["row"] == undefined
    );
    optionsRow.forEach((element) => optionsNoRow.splice(element.options.row, 0, element));
    return optionsNoRow;
  }

  get carAccessoryIsAllMarked() {
    return this.service.CarAccessory.chapeleira &&
      this.service.CarAccessory.macaco &&
      this.service.CarAccessory.palaSol &&
      this.service.CarAccessory.pneuSuplente &&
      this.service.CarAccessory.triangulo;
  }

  get isMovement() {
    return this.service.className == "Movement";
  }

  get isFuel() {
    return this.service.className == "Fuel";
  }

  get isPark() {
    return this.service.className == "Park";
  }
}
