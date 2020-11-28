import { Injectable } from "@angular/core";
import { CanActivate, Router, UrlTree } from "@angular/router";

@Injectable({
  providedIn: "root",
})
export class AccessGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(): true | UrlTree {
    if (localStorage.getItem("user") !== null) {
      return this.router.parseUrl("/boards");
    }
    return true;
  }
}
