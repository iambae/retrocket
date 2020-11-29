import { Injectable } from "@angular/core";
import { CanActivate, Router, UrlTree } from "@angular/router";

@Injectable({
  providedIn: "root",
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(): true | UrlTree {
    const isLoggedIn = JSON.parse(localStorage.getItem("user"));

    if (isLoggedIn) {
      return true;
    }

    return this.router.parseUrl("/login");
  }
}
