import { Observable } from "rxjs";
import { Component, OnInit } from "@angular/core";
import { Column } from "src/app/models/Column";
import { ColumnService } from "src/app/services/column.service";

@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
})
export class DashboardComponent implements OnInit {
  public columns$: Observable<Column[]>;

  constructor(private columnService: ColumnService) {}

  ngOnInit() {
    this.columns$ = this.columnService.getColumns();
  }
}
