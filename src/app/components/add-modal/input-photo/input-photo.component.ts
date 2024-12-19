import { Component, EventEmitter } from "@angular/core";
import { ModalController } from "@ionic/angular";
import { Alert } from "src/app/class/core/Alert";
import { DeviceService } from "src/app/services/device.service";
import { WebCamComponent, responseWebCam } from "ngx-webcam-controller";
import { InjectableService } from "@src/app/decorators/InjectableService";
import { Movement } from "@src/app/class/services/Movement";
import { CheckIn } from "@src/app/class/services/CheckIn";
import { PhotoAction } from "@src/app/services/photo.service";
import { Photo } from "@src/app/services/aws.service";
import { NgxImageCompressService } from "ngx-image-compress";

@Component({
  selector: "input-photo",
  templateUrl: "./input-photo.component.html",
  styleUrls: ["./input-photo.component.scss"],
})
export class InputPhotoComponent {
  service: Movement | CheckIn;
  images: number;
  imagesFail: number;

  constructor(
    public controller: InjectableService,
    public device: DeviceService,
    private modalNgx: ModalController,
    private imageCompress: NgxImageCompressService
  ) {
    controller.updateProperty("Photo");
    this.service = controller.service as any;
    this.images = this.service?.Photo?.length || 0;
    this.imagesFail = 0;
  }

  async openCameraModal() {
    const onSubmit = new EventEmitter();
    const onClose = new EventEmitter();
    const onRemove = new EventEmitter();
    // this.service.photoService.clear();
    const images: Photo[] = this.service.Photo.map((img) => {
      return {
        objectKey: img.Url,
        base64: img.Url,
      };
    });
    const imagesRemove = [];
    const modal = await this.modalNgx.create({
      component: WebCamComponent,
      backdropDismiss: true,
      componentProps: {
        maxImagesAllowed: 20,
        images: images,
        onSubmit: onSubmit,
        onClose: onClose,
        onRemove: onRemove,
      },
    });
    onClose.subscribe((data: responseWebCam) => {
      if (data.images.length !== this.service.Photo.length || data.images.find((image: any) => !this.service.Photo.find((item) => image == item.Url)))
        Alert.confirmAlert("global.confirmAlert.cancelModifications").then((res) => {
          if (res) modal.dismiss();
        });
      else modal.dismiss();
    });
    onSubmit.subscribe(async (data: responseWebCam) => {
      this.images = data.images.length;
      PhotoAction.create(this.imageCompress, this.service, this.controller.args[0], images, imagesRemove);
      modal.dismiss();
    });
    onRemove.subscribe(async (data: responseWebCam) => {
      if (confirm("Deseja realmente excluir este item?")) {
        data.images.forEach((image: any) => {
          if (image.objectKey.includes(this.controller.args[0])) imagesRemove.push(image);
        });
        data.component.remove(...data.images);
      }
    });
    return await modal.present().then(() => {});
  }
  /** Used on photo progress bar. */
  public get percent() {
    return this.service.Photo.length / this.service.Photo.length;
  }
}
