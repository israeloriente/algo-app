import { Component, OnInit, ViewChild } from "@angular/core";
import { GlobalService } from "../../services/global.service";
import { DeviceService } from "../../services/device.service";
import { DnnCore } from "../../services/dnn.core.service";
import { MenuController } from "@ionic/angular";
import { AppComponent } from "../../app.component";
import * as forms from "@angular/forms";
import { Alert } from "../../class/core/Alert";
import { environment } from "@root/environment";
import { Report } from "@src/app/class/Report";

/* Component in charge of the log in page. */
@Component({
  selector: "app-login",
  templateUrl: "./login.page.html",
  styleUrls: ["./login.page.scss"],
})
export class LoginPage implements OnInit {
  @ViewChild("user") user;
  @ViewChild("pass") pass;
  /** Version of the app currently installed. */
  versionApp: string;
  /** Build mode of the app currently installed. */
  buildMode: string;
  /* If user wants to reset their password, recovery is set to true. */
  recovery: boolean = false;
  /* Set to true to show the spinner while processing the request. */
  processingFormResetPasswordStep1: boolean = false;
  processingFormResetPasswordStep2: boolean = false;
  processingFormResetPasswordStep3: boolean = false;
  /* Form. */
  formLogin: forms.UntypedFormGroup;
  formResetPasswordStep1: forms.UntypedFormGroup;
  formResetPasswordStep2: forms.UntypedFormGroup;
  formResetPasswordStep3: forms.UntypedFormGroup;
  /* Copyright date. */
  dateCopyright: Date = new Date();

  resetPasswordStep: number;
  isAuthenticated: boolean;

  constructor(
    private authentication: DnnCore.Authentication,
    public global: GlobalService,
    private AC: AppComponent,
    private FormBuilder: forms.UntypedFormBuilder,
    private menu: MenuController,
    public device: DeviceService
  ) {
    this.formLogin = this.FormBuilder.group({
      username: ["", forms.Validators.required],
      password: ["", forms.Validators.required],
    });
  }

  /** Called when the page is loaded.
   *
   * Enables side menu. */
  async ngOnInit() {
    this.menu.enable(false);
    this.versionApp = await this.device.getAppVersion();
    this.buildMode = await this.device.getBuildMode();

    this.isAuthenticated = await DnnCore.Authentication.isUserAuthenticated();
    if (this.isAuthenticated) {
      await this.AC.initializeVariables(await DnnCore.Authentication.getCurrentUser());
    }
  }

  /** Called when the user presses the "Entrar" button.
   *
   * Verifies if the login information is correct. */
  async login() {
    this.global.simpleLoading();

    try {
      const currentUser = await this.authentication.login(this.formLogin.controls["username"].value, this.formLogin.controls["password"].value);

      if (currentUser) {
        await this.AC.initializeVariables(currentUser);
        if (!environment.production) console.log("initializeVariables", currentUser);
        Alert.simpleToast("global.toast.welcome", currentUser.DisplayName);
      } else {
        const isValidUser = await this.authentication.isValidUser(this.formLogin.controls["username"].value);
        if (!isValidUser) {
          Alert.simpleAlert("global.simpleAlert.loginFailed");
        } else {
          const isLockedOut = await this.authentication.isLockedOut(this.formLogin.controls["username"].value);
          if (isLockedOut) {
            Alert.simpleAlert("global.simpleAlert.accountIsLockedOut");
          } else {
            Alert.simpleAlert("global.simpleAlert.loginFailed");
          }
        }
      }
    } catch (error) {
      console.error("Error performing user login:", error);
    } finally {
      this.global.cancelLoad();
    }
  }

  beginResetPassword() {
    this.formResetPasswordStep1 = this.FormBuilder.group({
      username: [this.formLogin.value.username, forms.Validators.required],
    });
    this.formResetPasswordStep2 = this.FormBuilder.group({
      resetCode: ["", forms.Validators.compose([forms.Validators.minLength(6), forms.Validators.required])],
    });
    this.formResetPasswordStep3 = this.FormBuilder.group({
      password1: ["", forms.Validators.compose([forms.Validators.minLength(8), forms.Validators.required])],
      password2: ["", forms.Validators.compose([forms.Validators.minLength(8), forms.Validators.required])],
    });
    this.recovery = true;
    this.resetPasswordStep = 1;
  }

  async sendResetPasswordCode() {
    this.processingFormResetPasswordStep1 = true;
    this.authentication
      .sendResetPasswordCode(this.formResetPasswordStep1.value.username)
      .then((res) => {
        if (res.status == 200) {
          if (res.data == true) {
            this.resetPasswordStep = 2;
          } else {
            this.formResetPasswordStep1.get("username").setErrors({ Error: GlobalService.translate.instant("global.userAccountNotFound") });
          }
        } else {
          this.formResetPasswordStep1.get("username").setErrors({ Error: GlobalService.translate.instant("global.oops") });
        }
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        this.processingFormResetPasswordStep1 = false;
      });
  }

  isResetPasswordCodeValid() {
    this.processingFormResetPasswordStep2 = true;
    this.authentication
      .isResetPasswordCodeValid(this.formResetPasswordStep1.value.username, this.formResetPasswordStep2.value.resetCode)
      .then((res) => {
        if (res.status == 200) {
          if (res.data == true) {
            this.resetPasswordStep = 3;
          } else {
            this.formResetPasswordStep2.get("resetCode").setErrors({ Error: GlobalService.translate.instant("global.invalidCode") });
          }
        } else {
          this.formResetPasswordStep2.get("resetCode").setErrors({ Error: GlobalService.translate.instant("global.oops") });
        }
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        this.processingFormResetPasswordStep2 = false;
      });
  }

  resetPassword() {
    if (this.formResetPasswordStep3.value.password1 != this.formResetPasswordStep3.value.password2) {
      this.formResetPasswordStep3.get("password2").setErrors({ Error: GlobalService.translate.instant("global.passwordNoMatch") });
      return;
    }
    this.processingFormResetPasswordStep3 = true;
    this.authentication
      .updatePassword(
        this.formResetPasswordStep1.value.username,
        this.formResetPasswordStep2.value.resetCode,
        this.formResetPasswordStep3.value.password1,
        this.formResetPasswordStep3.value.password2
      )
      .then((res) => {
        if (res.status == 200) {
          if (res.data == true) {
            this.resetPasswordStep = 4;
            this.formLogin = this.FormBuilder.group({
              username: [this.formResetPasswordStep1.value.username, forms.Validators.required],
              password: ["", forms.Validators.required],
            });

            setTimeout(() => {
              this.recovery = false;
            }, 2000);
          } else {
            this.formResetPasswordStep3.get("password2").setErrors({ Error: GlobalService.translate.instant("global.newPasswordRejected") });
          }
        } else {
          this.formResetPasswordStep3.get("password2").setErrors({ Error: GlobalService.translate.instant("global.oops") });
        }
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        this.processingFormResetPasswordStep3 = false;
      });
  }
}
