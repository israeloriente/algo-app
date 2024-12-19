import { NgModule } from "@angular/core";
import { PreloadAllModules, Router, RouterModule, Routes } from "@angular/router";
import { AuthGuard } from "./auth.guard";

const routes: Routes = [
  {
    path: "",
    redirectTo: "",
    pathMatch: "full",
  },
  {
    path: "home",
    loadChildren: () => import("./pages/home/home.module").then((m) => m.HomePageModule),
    canActivate: [AuthGuard],
  },
  {
    path: "login",
    loadChildren: () => import("./pages/login/login.module").then((m) => m.LoginPageModule),
  },
  {
    path: "ajuda",
    loadChildren: () => import("./pages/ajuda/ajuda.module").then((m) => m.AjudaPageModule),
    canActivate: [AuthGuard],
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      preloadingStrategy: PreloadAllModules,
      enableTracing: false,
      initialNavigation: "disabled",
    }),
    RouterModule.forRoot(routes, {
      useHash: true,
      enableTracing: false,
      initialNavigation: "disabled",
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {
  private static router: Router;

  constructor(private router: Router) {
    AppRoutingModule.router = router;
  }

  public static addRoutes(path: string) {
    try {
      AppRoutingModule?.router?.config.unshift({
        path: path,
        loadChildren: () => import("./service/service.module").then((m) => m.ServicePageModule),
      });
    } catch (err) {
      console.log("Error adding routes", err);
    }
  }
}
