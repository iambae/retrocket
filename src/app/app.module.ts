import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { HttpClientModule } from "@angular/common/http";
import { environment } from "../environments/environment";
import { AngularFireModule } from "@angular/fire";
import { RouterModule } from "@angular/router";
import { AngularFirestoreModule } from "@angular/fire/firestore";
import { AngularFireAuthModule } from "@angular/fire/auth";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";

import { AppComponent } from "./app.component";
import { AppRoutingModule } from "./app-routing.module";
import { ComponentsModule } from "./components/components.module";

import { BoardService } from "./services/board.service";
import { CardService } from "./services/card.service";
import { ColumnService } from "./services/column.service";
import { ColorService } from "./services/color.service";

@NgModule({
  imports: [
    AngularFireModule.initializeApp(environment.firebaseConfig, "retrocket"),
    BrowserAnimationsModule,
    HttpClientModule,
    NgbModule,
    RouterModule,
    ComponentsModule,
    AppRoutingModule,
    AngularFirestoreModule,
    AngularFireAuthModule,
  ],
  declarations: [AppComponent],
  providers: [BoardService, CardService, ColumnService, ColorService],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule {}
