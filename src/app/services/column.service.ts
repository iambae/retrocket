import { Injectable } from "@angular/core";
import { Column } from "../models/index";
import { columns } from "../../assets/data/columns";

@Injectable()
export class ColumnService {
  private _columns: Column[];

  constructor() {
    this._columns = columns.sort((a, b) => a.order - b.order) as Column[];
  }

  getDefaultNames(): any {
    const names = {};
    this._columns.map(
      (column: Column, order: number) => (names[order] = column.name)
    );
    return names;
  }

  getColumns(): Column[] {
    return this._columns;
  }
}
