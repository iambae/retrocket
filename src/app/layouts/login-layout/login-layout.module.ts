import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { LoginLayoutRoutes } from "./login-layout.routing";

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(LoginLayoutRoutes),
    FormsModule,
  ],
  declarations: [],
})
export class LoginLayoutModule {}
