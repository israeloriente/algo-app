import { Injectable } from "@angular/core";
import { SwUpdate } from "@angular/service-worker";

@Injectable({
  providedIn: "root",
})
export class UpdateServiceWorkerService {
  constructor(private updates: SwUpdate) {}

  public checkForUpdates(): void {
    if (this.updates.isEnabled) {
		setInterval(() => {
		  this.updates.checkForUpdate().then((res) => {
			console.log(res);
			console.log('Verificação de atualização executada.');
		  });
		}, 3000); // Verifica a cada 60 segundos
	  }
  }

  public reloadApp(): void {
    window.location.reload();
  }
}
