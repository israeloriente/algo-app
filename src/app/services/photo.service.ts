import { Service } from "../class/services/Service";
import { AWSS3Service, Photo } from "./aws.service";
import { Report } from "src/app/class/Report";
import { NgxImageCompressService } from "ngx-image-compress";
import { Alert } from "../class/core/Alert";

interface CheckController {
  qtd: number;
  actions: PhotoAction[];
  service: Service;
  attempts: number;
  isComplete: boolean;
}

export class PhotoAction {
  public status: "success" | "fail" = "fail";
  public url: string = null;
  public action: "add" | "remove" = "add";
  public statusProgress: "complete" | "progress" = "progress";
  public static readonly MAX_ATTEMPTS = 3;
  public static readonly MAX_MEGABYTE = 2;
  public isCompression: boolean = false;
  public id: number = 0;

  constructor(
    private imageCompress: NgxImageCompressService,
    public photo: Photo,
    public bucketName: string,
    action: "add" | "remove",
    public check: CheckController
  ) {
    this.action = action;
  }

  public async compress(): Promise<boolean> {
    const imgeBase64 = this.photo.base64;
    try {
      if (!this.isCompression && this.photo.base64.length > PhotoAction.MAX_MEGABYTE * 1024) {
        this.isCompression = true;
        return await this.imageCompress
          .compressFile(imgeBase64, -1, 70, 50)
          .then((result) => {
            this.photo.base64 = result;
            return true;
          })
          .catch((e) => {
            this.photo.base64 = imgeBase64;
            new Report(e, "class.services.PhotoAction.compress", false);
            return false;
          });
      } else {
        return true;
      }
    } catch (e) {
      this.photo.base64 = imgeBase64;
      new Report(e, "class.services.PhotoAction.compress", false);
      return false;
    }
  }

  public async execute() {
    this.statusProgress = "progress";
    try {
      if (this.action == "add") {
        await this.compress();
        await this.send();
      } else if (this.action == "remove") {
        await this.remove();
      }
    } catch (e) {
      this.status = "fail";
      new Report(e, "class.services.PhotoAction.execute", false);
    }
    this.statusProgress = "complete";
    this.checkComplete();
  }

  private async checkComplete() {
    const complete = this.check.qtd == this.check.actions.filter((e) => e.statusProgress == "complete").length;
    if (complete) {
      const fail = this.check.actions.filter((e) => e.status == "fail") || [];
      if (fail.length > 0 && this.check.attempts <= PhotoAction.MAX_ATTEMPTS) {
        PhotoAction.executeAll(this.check, fail);
        return;
      } else if (!this.check.isComplete) {
        this.check.service.Photo =
          this.check.actions
            .filter((e) => e.url != undefined && e.status == "success")
            .map((e) => {
              return { Url: e.url };
            }) || [];
        this.check.isComplete = true;
        await this.check.service.update().finally(() => {
          const fails = this.check.actions.filter((e) => e.status == "fail");
          if (fails.length > 0) {
            Alert.simpleAlert("global.simpleAlert.imageError");
            new Report({ message: `Error to send images: ${fails.length}` }, "class.services.PhotoAction.checkComplete", false);
            fail.forEach((e) => e.dowlonad());
          }
          this.check.service.photoStatus = "complete";
        });
      }
    }
  }

  private async send() {
    try {
      if (!this.photo.objectKey.includes(this.bucketName)) {
        const date = new Date();
        await AWSS3Service.uploadImageBase64(
          this.bucketName,
          `${this.check.service.className}-${this.check.service.Id}/${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}/${
            this.photo.objectKey
          }`,
          this.photo.base64
        )
          .then((objectKey: string) => {
            this.photo.objectKey = objectKey;
            this.url = objectKey;
            this.status = "success";
            this.action = "add";
          })
          .catch((e) => {
            new Report(e, "class.services.PhotoAction.send", false);
            this.url = undefined;
            this.status = "fail";
          });
      } else {
        this.url = this.photo.objectKey;
        this.status = "success";
      }
    } catch (e) {
      new Report(e, "class.services.PhotoAction.send", false);
      this.status = "fail";
    }
  }

  public async dowlonad() {
    if (!this.photo?.objectKey?.includes(this.bucketName)) {
      const a = document.createElement("a");
      a.href = this.photo.base64;
      a.download = `${this.check?.service?.Id || "service"}-${this.photo.objectKey}`;
      a.click();
    }
  }

  private async remove() {
    this.action = "remove";
    this.status = "success";
  }

  public static executeAll(check: CheckController, actions: PhotoAction[]) {
    if (check.attempts <= PhotoAction.MAX_ATTEMPTS) {
      actions.forEach((action) => action.execute());
    }
    check.attempts++;
  }

  public static async create(
    imageCompress: NgxImageCompressService,
    service: Service,
    bucketName: string,
    imagesAdd: Photo[],
    imagesRemove: Photo[] = []
  ): Promise<PhotoAction[]> {
    service.photoStatus = "progress";
    const actions: PhotoAction[] = [];
    const check: CheckController = {
      qtd: imagesAdd.length + imagesRemove.length,
      actions,
      service,
      attempts: 0,
      isComplete: false,
    };
    let id = 0;
    for await (let photo of imagesAdd) {
      actions.push(new PhotoAction(imageCompress, photo, bucketName, "add", check));
    }
    for await (let photo of imagesRemove) {
      actions.push(new PhotoAction(imageCompress, photo, bucketName, "remove", check));
    }
    for await (let action of actions) {
      action.id = id++;
    }
    PhotoAction.executeAll(check, actions);
    return actions;
  }
}
