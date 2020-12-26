import { Injectable } from "@angular/core";
import { CanActivate, Router, UrlTree } from "@angular/router";

@Injectable({
  providedIn: "root",
})
/**
 * Allows access to requested board only if user data
 * exists in current session, otherwise redirects user
 * to StartComponent to start a new auth flow
 */
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(): true | UrlTree {
    const isLoggedIn = JSON.parse(sessionStorage.getItem("user"));

    if (isLoggedIn) {
      return true;
    }

    return this.router.parseUrl("/start");
  }
}
