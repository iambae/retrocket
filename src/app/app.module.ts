import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { HttpClientModule } from "@angular/common/http";
import { RouterModule } from "@angular/router";
import { environment } from "../environments/environment";
import { AngularFireModule } from "@angular/fire";
import { AngularFirestoreModule } from "@angular/fire/firestore";
import { AngularFireAuthModule } from "@angular/fire/auth";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";

import { AppComponent } from "./app.component";
import { AppRoutingModule } from "./app-routing.module";
import { ComponentsModule } from "./components/components.module";

import { BoardService } from "./services/board.service";
import { CardService } from "./services/card.service";
import { ColumnService } from "./services/column.service";
import { RouteService } from "./services/route.service";
import { ColorService } from "./services/color.service";

@NgModule({
  imports: [
    BrowserAnimationsModule,
    HttpClientModule,
    ComponentsModule,
    NgbModule,
    RouterModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebaseConfig, "retrocket"),
    AngularFirestoreModule,
    AngularFireAuthModule,
  ],
  declarations: [AppComponent],
  providers: [
    BoardService,
    CardService,
    ColumnService,
    RouteService,
    ColorService,
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule {}
