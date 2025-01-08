import { Injectable } from "@angular/core";
import { SwUpdate } from "@angular/service-worker";

@Injectable({
  providedIn: "root",
})
export class UpdateServiceWorkerService {
  constructor(private updates: SwUpdate) {}

  public checkForUpdates(): void {
    if (this.updates.isEnabled) {
      this.updates.versionUpdates.subscribe((event) => {
        if (event.type === "VERSION_READY") {
          console.log("Nova versão disponível! Aplicando atualização...");
          this.updates.activateUpdate().then(() => {
            this.reloadApp();
          });
        }
      });
    }
  }

  public reloadApp(): void {
    window.location.reload();
  }
}
