import { JoinComponent } from "./components/join/join.component";
import { RegisterComponent } from "./components/register/register.component";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { BrowserModule } from "@angular/platform-browser";
import { Routes, RouterModule } from "@angular/router";
import { LoginComponent } from "./components/login/login.component";
import { DashboardComponent } from "./components/dashboard/dashboard.component";
import { DashboardListComponent } from "./components/dashboard/dashboard-list.component";
import { AuthGuard } from "./auth/auth.guard";
import { AnonGuard } from "./auth/anon.guard";

const routes: Routes = [
  {
    path: "login",
    component: LoginComponent,
  },
  {
    path: "join/:id",
    component: JoinComponent,
  },
  {
    path: "boards/:id",
    component: DashboardComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "boards",
    component: DashboardListComponent,
    canActivate: [AnonGuard],
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
})
export class AppRoutingModule {}
