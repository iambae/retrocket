import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { Route } from "../models/index";

@Injectable()
export class RouteService {
  constructor(private http: HttpClient) {}

  getRoutes(): Observable<Array<Route>> {
    return this.http.get<Array<Route>>("../../assets/data/routes.json");
  }
}
