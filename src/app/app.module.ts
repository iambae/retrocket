import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { HttpClientModule } from "@angular/common/http";
import { RouterModule } from "@angular/router";
import { environment } from "../environments/environment";
import { AngularFireModule } from "@angular/fire";
import { AngularFirestoreModule } from "@angular/fire/firestore";
import { AngularFireAuthModule } from "@angular/fire/auth";

import { AppComponent } from "./app.component";
import { DashboardLayoutComponent } from "./layouts/dashboard-layout/dashboard-layout.component";
import { LoginLayoutComponent } from "./layouts/login-layout/login-layout.component";

import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { CardService } from "./services/card.service";
import { ColumnService } from "./services/column.service";
import { AppRoutingModule } from "./app-routing.module";
import { ComponentsModule } from "./components/components.module";

@NgModule({
  imports: [
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    ComponentsModule,
    NgbModule,
    RouterModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebaseConfig, "retrocket"),
    AngularFirestoreModule,
    AngularFireAuthModule,
  ],
  declarations: [AppComponent, DashboardLayoutComponent, LoginLayoutComponent],
  providers: [CardService, ColumnService],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule {}
