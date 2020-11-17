import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { FormsModule } from "@angular/forms";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { MenubarComponent } from "./menubar/menubar.component";
import { MenuComponent } from "./menubar/menu/menu.component";
import { CardComponent } from "./card/card.component";
import { ColumnHeaderComponent } from "./column-header/column-header.component";
import { ColumnComponent } from "./column/column.component";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { LoginComponent } from "./login/login.component";
import { AddClassDirective } from "../shared/add-class.directive";
import { RegisterComponent } from './register/register.component';

@NgModule({
  imports: [CommonModule, RouterModule, NgbModule, FormsModule],
  declarations: [
    DashboardComponent,
    LoginComponent,
    MenubarComponent,
    MenuComponent,
    ColumnComponent,
    ColumnHeaderComponent,
    CardComponent,
    AddClassDirective,
    RegisterComponent,
  ],
  exports: [
    DashboardComponent,
    LoginComponent,
    MenubarComponent,
    MenuComponent,
    ColumnComponent,
    CardComponent,
    AddClassDirective,
  ],
})
export class ComponentsModule {}
