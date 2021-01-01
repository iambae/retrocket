import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { BrowserModule } from "@angular/platform-browser";
import { Routes, RouterModule } from "@angular/router";
import { DashboardComponent } from "./components/dashboard/dashboard.component";
import { BoardComponent } from "./components/board/board.component";
import { NotFoundComponent } from "./components/not-found/not-found.component";
import { JoinComponent } from "./components/join/join.component";
import { AuthGuard } from "./guards/auth.guard";
import { DashboardGuard } from "./guards/dashboard.guard";
import { BoardGuard } from "./guards/board.guard";
import { AuthComponent } from "./components/auth/auth.component";

const routes: Routes = [
  {
    path: "dashboard",
    component: DashboardComponent,
    canActivate: [DashboardGuard],
  },
  {
    path: "join/:id",
    component: JoinComponent,
    canActivate: [BoardGuard],
  },
  {
    path: "board/:id",
    component: BoardComponent,
    canActivate: [AuthGuard, BoardGuard],
  },
  {
    path: "not-found",
    component: NotFoundComponent,
  },
  {
    path: "start",
    component: AuthComponent,
  },
  {
    path: "",
    redirectTo: "start",
    pathMatch: "full",
  },
  {
    path: "**",
    redirectTo: "start",
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
