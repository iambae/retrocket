import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { map as rxMap } from "rxjs/operators";
import { HttpClient } from "@angular/common/http";
import { Color } from "../models";

@Injectable()
export class ColorService {
  public colors: Observable<Color[]>;

  constructor(public http: HttpClient) {
    this.colors = this.http.get<Color[]>("../../assets/data/colors.json");
  }

  getColor(value: string): Observable<Color> {
    return this.colors.pipe(
      rxMap((colors) => colors.find((color) => color.value === value))
    );
  }
}
