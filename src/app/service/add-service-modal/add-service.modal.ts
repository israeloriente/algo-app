import { Component, ElementRef, Injector, ViewChild } from "@angular/core";
import { ModalController, NavParams } from "@ionic/angular";
import { GlobalService } from "../../services/global.service";
import { Events } from "src/app/services/events";
import { Alert } from "src/app/class/core/Alert";
import { OnValidation, Service } from "src/app/class/services/Service";
import { Report } from "src/app/class/Report";
import { InjectableService } from "@src/app/decorators/InjectableService";
import { PageStatusService, ServicePage, updatePages } from "@src/app/decorators/ServiceComponent";
import { AppComponent } from "@src/app/app.component";
import { environment } from "@root/environment";
import { SelectClientComponent } from "@src/app/components/add-modal/select-client/select-client.component";

@Component({
  selector: "app-add-service-modal",
  templateUrl: "./add-service.modal.html",
  styleUrls: ["./add-service.modal.scss"],
})
export class AddServiceModal implements OnValidation {
  /** Data related to vehicle. */
  // public newCar: parse.Mov & parse.Abs;
  /** Data related to previous successfully added mov item. */
  public lastMov: Service;
  /** Name of user logged in the app. */
  // public user: parse.User;
  /** Place where the user is logged/working. */
  // public StationId: Station;
  /** List of origins and destinations. */
  public places = [];
  public frontendStatus: "editing" | "moving" = "editing";

  slideOpts = {
    initialSlide: 0,
    speed: 200,
  };

  public injectableServices: Injector[] = [];

  public service: Service | any;
  private indexSlide: number = 0;

  /**
   * Used to prevent unnecessary updates.
   */
  public serviceBackup: Service | any;
  // static
  @ViewChild("swiper", { static: true })
  swiperContainer: ElementRef | undefined;

  constructor(private global: GlobalService, private params: NavParams, public modalAddPlate: ModalController, private ev: Events) {
    this.service = this.params.get("service");
    this.lastMov = this.params.get("lastMov");
    if (!this.service.CarId && this.params.get("plate")) this.service.Plate = this.params.get("plate");
    this.indexSlide = this.service.Id == 0 ? 0 : GlobalService.Config.isMultiClient ? 2 : this.service.StartDate ? this.pages.length - 1 : 1;

    // Listen to the event that closes the modal.
    this.ev.subscribe("CloseServiceModal", async () => await this.modalAddPlate.dismiss());

    if (!GlobalService.Config.isMultiClient) {
      if (this.pages[0]?.components[0] == SelectClientComponent) this.pages.shift();
    } else if (this.pages[0]?.components[0] != SelectClientComponent) {
      this.pages.unshift({ components: [SelectClientComponent] });
      updatePages(this.pages);
    }
    const injectableServices: Injector[] = [];

    for (let i = 0; i < this.pages.length; i++) {
      if (this.pages[i] != undefined && this.pages[i].components != undefined && this.pages[i].components.length > 0)
        this.createInjectableService(this.pages[i], injectableServices, i);
    }
    this.injectableServices = injectableServices;
    this.service.ClientName = GlobalService.Config.client?.Label;
  }

  // Destroy the event listener when the component is destroyed.
  ngOnDestroy(): void {
    this.ev.destroy("CloseServiceModal");
  }

  private createInjectableService(page: ServicePage, injectableServices: Injector[], slideIndex: number = 0) {
    const pageStatus = new PageStatusService();
    pageStatus.status = page.status;
    pageStatus.args = page.args || [];
    injectableServices[slideIndex] = Injector.create({
      providers: [
        {
          provide: InjectableService,
          useValue: new InjectableService(this.service, pageStatus, new Number(slideIndex)),
        },
      ],
    });
    const injectableService: InjectableService = injectableServices[slideIndex].get(InjectableService);
    slideIndex -= 1;
    if (slideIndex >= 0) injectableService.addOnValidation(injectableServices[slideIndex].get(InjectableService));
    if (pageStatus.new == this.service.Status && pageStatus.isFixedPage == true) this.indexSlide = slideIndex + 1;
  }

  logActiveIndex() {}

  /** Used every time component is loaded. */
  async ionViewDidEnter() {
    if (this.indexSlide > 0) this.swiperContainer.nativeElement.swiper.slideTo(this.indexSlide);
  }

  ngAfterViewInit() {
    this.swiperContainer.nativeElement.swiper.allowTouchMove = false;
    this.injectableServices.forEach((injector) => {
      injector.get(InjectableService).setSlides(this.swiperContainer.nativeElement.swiper);
    });
  }

  /** Creates an abs item in Parse. */
  async create() {
    this.service
      .create()
      .then(async (res) => {
        Alert.simpleToast("global.toast.serviceCreated");
        this.modalAddPlate.dismiss({ status: "create", service: res });
        Service.lastCarUsed = this.service;
      })
      .catch(async (e) => {
        console.log("Error creating service: ", e);
      })
      .finally(async () => await this.global.cancelLoad());
  }

  finish() {
    this.service.Status = 0;
    this.service
      .update("status")
      .then(() => {
        this.modalAddPlate.dismiss({ status: "create", service: this.service });
      })
      .catch((err: any) => {
        Alert.simpleAlert("global.simpleAlert.errorUpdate", err?.message);
        new Report(err, "AddPlateModalPage.slideNext", false);
      });
  }

  // @@@@@@@@@@@@@@@@@@@@ RESPONSE CHILD COMPONENTS @@@@@@@@@@@@@@@@@@@@
  /** Callback from keyboard component.
   * @param value - license plate.
   */
  async KeyboardResponse(value: { plate: string }) {
    this.service.Plate = this.global.validatePlate(value.plate);
    this.slideNext();
  }

  responseOriginDestiny(data) {
    if (data.place_2) this.slideNext();
  }

  async closeModal() {
    if (this.service.Status == 0) this.modalAddPlate.dismiss({ status: "create", service: this.service });
    else {
      if (this.service.Id == 0) this.modalAddPlate.dismiss();
      else if (this.service.Id != 0 || this.service.Status > 0) this.modalAddPlate.dismiss({ status: "create", service: this.service });
    }
  }

  onClick(key: string) {
    console.log(key);
  }

  /** Called when there's a change in slide.
   * Updates "isEnd" and "slideIndex" variables.
   */
  async slideMudando() {
    if (this.slideIndex == 1) this.ev.publish("setFocusFirstInput", null);
  }

  /** Shows user next slide we save some attributes */
  slideNext() {
    const index = this.swiperContainer.nativeElement.swiper.activeIndex;
    this.injectableServices[index].get(InjectableService).slideNext();
  }

  /** Shows user previous slide. */
  slidePrev() {
    // this.slides.lockSwipes(false);
    this.swiperContainer.nativeElement.swiper.slidePrev();
  }
  /** Initializes slide. */
  slideInit() {
    // this.slides.nativeElement.swiper.lockSwipes(false);
    this.swiperContainer.nativeElement.swiper.slideTo(0);
    // this.slides.nativeElement.swiper.lockSwipes(true);
  }

  slidechange(e: any) {}

  onSlideChange() {}

  isResponse() {
    this.service.Status = 0;
    this.service.update("description", "chef").catch((err) => {
      Alert.simpleAlert("global.simpleAlert.errorUpdate", err?.message);
      this.swiperContainer.nativeElement.swiper.slidePrev();
      new Report(err, "AddPlateModalPage.slideNext", false);
    });
    this.frontendStatus = "moving";
  }

  get slideIndex() {
    return this.swiperContainer ? this.swiperContainer.nativeElement.swiper.activeIndex : 0;
  }

  get isEnd() {
    return this.swiperContainer ? this.swiperContainer.nativeElement.swiper.isEnd : false;
  }

  /** Gets information related to license plate.
   * @returns license plate string.
   */
  get getPlate() {
    return this.service.Plate;
  }

  /** Gets information related to the user's working station.
   * @returns currentStation information.
   */
  // get getStation() {
  //   return this.currentStation;
  // }
  /** Gets information related to method to input info to send to database.
   * @returns string - "keyboard" means the user is using a keyboard to input info.
   */
  get isKeyboard() {
    return this.service.ScannerType == "keyboard";
  }
  /** Gets information related to car accessories.
   * @returns CarAccessory values for each accessory.
   */
  get getCarAccessory() {
    return this.service.carAccessory;
  }

  get isSendingPhoto() {
    return this.service?.isSendingPhotos;
    // return this.isMov && this.service?.isSendingPhotos;
  }

  get isEditing() {
    return this.frontendStatus === "editing";
  }

  get isMoving() {
    return this.frontendStatus === "moving";
  }

  get pages() {
    return Service.SELECT.pages;
  }

  get isValid(): boolean {
    return this.injectableServices[this.slideIndex].get(InjectableService).isValid;
  }
}
