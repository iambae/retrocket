import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { MatDialogModule } from "@angular/material/dialog";
import { MatInputModule } from "@angular/material/input";
import { MatFormFieldModule } from "@angular/material/form-field";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { MenubarComponent } from "./menubar/menubar.component";
import { MenuComponent } from "./menubar/menu/menu.component";
import { CardComponent } from "./card/card.component";
import { ColumnHeaderComponent } from "./column-header/column-header.component";
import { ColumnComponent } from "./column/column.component";
import { DashboardComponent } from "./dashboard/dashboard.component";
import {
  DashboardListComponent,
  DialogComponent,
} from "./dashboard/dashboard-list.component";
import { DashboardListItemComponent } from "./dashboard/dashboard-list-item.component";
import { LoginComponent } from "./login/login.component";
import { AddClassDirective } from "../shared/add-class.directive";
import { RegisterComponent } from "./register/register.component";
import { JoinComponent } from "./join/join.component";

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    NgbModule,
    FormsModule,
    MatDialogModule,
    MatInputModule,
    MatFormFieldModule,
    ReactiveFormsModule,
  ],
  declarations: [
    DashboardComponent,
    DashboardListComponent,
    DialogComponent,
    DashboardListItemComponent,
    LoginComponent,
    RegisterComponent,
    MenubarComponent,
    MenuComponent,
    ColumnComponent,
    ColumnHeaderComponent,
    CardComponent,
    AddClassDirective,
    JoinComponent,
  ],
  exports: [
    DashboardComponent,
    DashboardListComponent,
    DialogComponent,
    DashboardListItemComponent,
    LoginComponent,
    RegisterComponent,
    MenubarComponent,
    MenuComponent,
    ColumnComponent,
    ColumnHeaderComponent,
    CardComponent,
    AddClassDirective,
  ],
})
export class ComponentsModule {}
