import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { BrowserModule } from "@angular/platform-browser";
import { Routes, RouterModule } from "@angular/router";
import { DashboardLayoutComponent } from "./layouts/dashboard-layout/dashboard-layout.component";
import { LoginLayoutComponent } from "./layouts/login-layout/login-layout.component";

const routes: Routes = [
  {
    path: "",
    redirectTo: "dashboard",
    pathMatch: "full",
  },
  {
    path: "",
    component: DashboardLayoutComponent,
    children: [
      {
        path: "",
        loadChildren:
          "./layouts/dashboard-layout/dashboard-layout.module#DashboardLayoutModule",
      },
    ],
  },
  {
    path: "",
    component: LoginLayoutComponent,
    children: [
      {
        path: "",
        loadChildren:
          "./layouts/login-layout/login-layout.module#LoginLayoutModule",
      },
    ],
  },
  {
    path: "**",
    redirectTo: "dashboard",
  },
];

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    RouterModule.forRoot(routes, {
      useHash: true,
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
