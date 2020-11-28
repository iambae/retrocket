import { Injectable } from "@angular/core";
import { CanActivate, Router, UrlTree } from "@angular/router";

@Injectable({
  providedIn: "root",
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(): true | UrlTree {
    if (localStorage.getItem("user") !== null) {
      return true;
    }
    return this.router.parseUrl("/login");
  }
}
