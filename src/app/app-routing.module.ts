import { RegisterComponent } from "./components/register/register.component";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { BrowserModule } from "@angular/platform-browser";
import { Routes, RouterModule } from "@angular/router";
import { LoginComponent } from "./components/login/login.component";
import { DashboardComponent } from "./components/dashboard/dashboard.component";
import { DashboardListComponent } from "./components/dashboard/dashboard-list.component";
import { AuthGuard } from "./auth/auth.guard";

const routes: Routes = [
  {
    path: "boards",
    component: DashboardListComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "boards/:id",
    component: DashboardComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "login",
    component: LoginComponent,
    data: { redirectToBoards: true },
    canActivate: [AuthGuard],
  },
  { path: "register", component: RegisterComponent },

  {
    path: "",
    redirectTo: "boards",
    pathMatch: "full",
  },
  {
    path: "**",
    redirectTo: "boards",
  },
];

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    RouterModule.forRoot(routes, {
      onSameUrlNavigation: "reload",
    }),
  ],
  exports: [RouterModule],
  providers: [AuthGuard],
})
export class AppRoutingModule {}
