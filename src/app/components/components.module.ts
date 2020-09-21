import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { FormsModule } from "@angular/forms";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { SidebarComponent } from "./sidebar/sidebar.component";
import { CardComponent } from "./card/card.component";
import { ColumnHeaderComponent } from "./column-header/column-header.component";
import { ColumnComponent } from "./column/column.component";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { LoginComponent } from "./login/login.component";
import { AddClassDirective } from "../shared/add-class.directive";

@NgModule({
  imports: [CommonModule, RouterModule, NgbModule, FormsModule],
  declarations: [
    DashboardComponent,
    LoginComponent,
    SidebarComponent,
    ColumnComponent,
    ColumnHeaderComponent,
    CardComponent,
    AddClassDirective,
  ],
  exports: [
    DashboardComponent,
    LoginComponent,
    SidebarComponent,
    ColumnComponent,
    CardComponent,
    AddClassDirective,
  ],
})
export class ComponentsModule {}
