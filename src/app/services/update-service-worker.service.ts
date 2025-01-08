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
        switch (event.type) {
          case "VERSION_READY":
            if (confirm("Uma nova versão está disponível. Deseja atualizar agora?")) {
              this.reloadApp();
            }
            break;
        }
      });
    }
  }

  public reloadApp(): void {
    window.location.reload();
  }
}
