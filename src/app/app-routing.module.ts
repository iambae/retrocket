import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { BrowserModule } from "@angular/platform-browser";
import { Routes, RouterModule } from "@angular/router";
import { DashboardComponent } from "./components/dashboard/dashboard.component";
import { DashboardListComponent } from "./components/dashboard/dashboard-list.component";
import { NotFoundComponent } from "./components/not-found/not-found.component";
import { JoinComponent } from "./components/join/join.component";
import { AuthGuard } from "./guards/auth.guard";
import { AnonGuard } from "./guards/anon.guard";
import { BoardGuard } from "./guards/board.guard";
import { AuthComponent } from "./components/auth/auth.component";

const routes: Routes = [
  {
    path: "start",
    component: AuthComponent,
  },
  {
    path: "join/:id",
    component: JoinComponent,
    canActivate: [BoardGuard],
  },
  {
    path: "board/:id",
    component: DashboardComponent,
    canActivate: [AuthGuard, BoardGuard],
  },
  {
    path: "boards",
    component: DashboardListComponent,
    canActivate: [AnonGuard],
  },
  {
    path: "not-found",
    component: NotFoundComponent,
  },
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
