import { ErrorHandler, Injectable, NgModule } from "@angular/core";
import { NavController } from "@ionic/angular";
import { environment } from "@root/environment";
import { Report } from "../class/Report";
import { GlobalService } from "../services/global.service";

@Injectable()
export class UncaughtHandler implements ErrorHandler {
  constructor(private nav: NavController, private global: GlobalService) {}
  handleError(error: any): void {
    if (environment.production || environment.staging) {
      if (!Report.ignoreError(error.message)) Report.sendLog(error.message, "Uncaught");
    } else console.error(error);
  }
}

@NgModule({
  providers: [{ provide: ErrorHandler, useClass: UncaughtHandler }],
})
export class AppHandleErrorModule {}
