import { Component, Input } from "@angular/core";
import { Column } from "../../models/index";

@Component({
  selector: "app-column-header",
  templateUrl: "./column-header.component.html",
})
export class ColumnHeaderComponent {
  @Input() column: Column;
  @Input() count: Number;

  constructor() {}
}
