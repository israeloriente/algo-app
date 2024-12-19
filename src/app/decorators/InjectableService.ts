import { OnValidation, Service } from "../class/services/Service";
import { Injectable, inject } from "@angular/core";
import { Alert } from "../class/core/Alert";
import Swiper from "swiper";
import { PageStatusService, serviceStatus } from "./ServiceComponent";
import { Report } from "../class/Report";
import _ from "lodash";
import { Events } from "../services/events";
import { DnnCore } from "../services/dnn.core.service";

export function isEqual(a: any, b: any): boolean {
  if (a != undefined && b == undefined) return false;
  if (b != undefined && a == undefined) return false;
  if (a == b) return true;
  if (a instanceof Date && b instanceof Date) return a.getTime() == b.getTime();
  if (a instanceof Array && b instanceof Array) return a.length == b.length && a.every((v, i) => isEqual(v, b[i]));
  if (a instanceof Object && b instanceof Object)
    return Object.keys(a).length == Object.keys(b).length && Object.keys(a).every((k) => isEqual(a[k], b[k]));
  return false;
}

/**
 * This Injectable allows a component to control the page on
 * which it is located. It also allows automated validation
 * of added components, as well as the process of updating
 * variables in the database.
 * */
@Injectable()
export class InjectableService implements OnValidation {
  private _service: Service;
  private ev: Events = new Events();
  private slides: Swiper = undefined;
  public pageStatus: number;
  private slideIndex: number = 0;
  // private data: Map<string, any> = new Map<string, any>();
  private propertyNames: string[] = [];
  public status: serviceStatus;
  private onValidations: OnValidation[] = [];
  public static updateServices: Function[] = [];
  public args: any[] = [];

  constructor(service: Service, pageStatus: PageStatusService, slideIndex: Number) {
    this._service = service;
    this.args = pageStatus.args;
    this.slideIndex = slideIndex.valueOf() - 1;
    this.ev = inject(Events);
    if (Service.SELECT.pages.length > 0) {
      const pageStatusLast = Service.SELECT.pages[Service.SELECT.pages.length - 1].status;
      this.status = pageStatusLast.new == this.service.Status ? "edit" : "new";
    } else this.status = "new";
    this.pageStatus = this.status == "new" ? pageStatus.new : pageStatus.edit;
  }

  /**
   * returns true if all validations are valid
   * */
  get isValid(): boolean {
    for (const onValidation of this.onValidations) {
      if (onValidation.isValid == false) return false;
    }
    return true;
  }

  /**
   * returns the service associated with this controller
   * */
  get service(): Service {
    return this._service;
  }

  /**
   * allows you to set the swiper controller for this service
   * */
  public setSlides(slides: Swiper) {
    this.slides = slides;
  }

  /**
   * allows you to advance to the previous slide
   * */
  public slidePrev() {
    this.slides.slidePrev();
  }

  /**
   * allow you to add a validation function to this controller, this
   * function is executed on the slide page to check if the controller is
   * valid or not
   * */
  public addOnValidation(onValidation: OnValidation) {
    this.onValidations.push(onValidation);
  }

  /**
   * allow you to remove a validation function from this controller
   * */
  public removeOnValidation(onValidation: OnValidation) {
    this.onValidations = this.onValidations.filter((o) => o != onValidation);
  }

  /**
   * This function allows you to advance to the next
   * slide and update all the variables related to the current page
   * */
  public async slideNext() {
    this.slides.slideNext();
    const saveService = async () => {
      this.save()
        .catch(async (e) => {
          if (e?.ignore) return;
          if (e?.message.includes("DuplicatedPlate")) await Alert.simpleAlert("global.simpleAlert.duplicatedPlate", this.service?.Plate);
          else if (e?.message.includes("Unauthorized")) {
            DnnCore.Authentication.logout();
            await Alert.simpleAlert("global.simpleAlert.unauthorized");
            this.ev.publish("CloseServiceModal", null);
          } else new Report(e, "decorators.InjectableService.slideNext");
          this.slideTo(this.slideIndex);
        })
        .finally(() => {
          InjectableService.updateServices.splice(InjectableService.updateServices.indexOf(saveService), 1);
          if (InjectableService.updateServices.length > 0) InjectableService.updateServices[0]();
        });
    };
    InjectableService.updateServices.push(saveService);
    if (InjectableService.updateServices.length == 1) saveService();
    return this.service;
  }

  /**
   * allows you to advance to the slide with the index passed by parameter
   * */
  public slideTo(index: number) {
    this.slides.slideTo(index);
  }

  /**
   * returns the index of the current slide
   * */
  public getSlideIndex(): number {
    return this.slides.activeIndex;
  }

  public addService(service: Service) {
    this._service = service;
  }

  /**
   * allows you to record the properties that can be saved when the slide is changed.
   * */
  public updateProperty(...propertyNames: string[]): void {
    this.updateData(this.status, ...propertyNames);
    this.propertyNames.push(...propertyNames.filter((p) => !this.propertyNames.includes(p)));
  }

  /**
   * updates the date with the values of the variables on the current page, allowing
   * you to check when you save whether the variables have been updated or not
   * */
  private updateData(status: serviceStatus, ...propertyNames: string[]): void {
    // this.data.clear();
    // propertyNames.forEach((key) => {
    //   if (key != "photo" && this.service.hasOwnProperty(key)) this.data.set(key, status == "new" ? undefined : _.cloneDeep(this.service[key]));
    // });
  }

  /***
   * This function performs an update on the variables registered in 'updateProperty'.
   * It can be triggered independently or automatically when advancing to the next slide.
   */
  public async save(...propertyNames: string[]): Promise<any> {
    if (propertyNames.length > 0) this.updateProperty(...propertyNames);
    // if (this.service.Status != 0) {
    //   console.log("Abaixo");
    //   console.log(this.pageStatus);
    //   this.service.Status = this.pageStatus;
    // }
    propertyNames = this.propertyNames;
    // propertyNames = propertyNames.filter((key) => {
    //   return (key.charAt(0) === key.charAt(0).toUpperCase()) || !isEqual(this.service[key], this.data.get(key))
    // }
    // );
    return new Promise((resolve, reject) => {
      if (propertyNames.length == 0) resolve(this.service);
      else {
        this.service
          .update(...propertyNames, `serviceStatus:${this.status}`)
          .then((service) => {
            this.updateData("edit", ...this.propertyNames);
            resolve(service);
          })
          .catch((e) => {
            reject(e);
          });
      }
    });
  }
}
