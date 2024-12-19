import { Injectable, NgModule } from "@angular/core";
import { ServiceWorkerModule } from "@angular/service-worker";
import { environment } from "@root/environment";

@Injectable()
@NgModule({
  imports: [
    ServiceWorkerModule.register("ngsw-worker.js", {
      // Enable PWA only in staging or production environments
      enabled: environment.production || environment.staging,
      // Register the ServiceWorker as soon as the app is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: "registerWhenStable:30000",
    }),
  ],
})
export class AppServiceWorkerModule {}
