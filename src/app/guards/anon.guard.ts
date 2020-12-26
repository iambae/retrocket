import { Injectable } from "@angular/core";
import { CanActivate, Router, UrlTree } from "@angular/router";

@Injectable({
  providedIn: "root",
})
/**
 * Allows access to dashboard that lists previous boards 
 * if user data persists in session storage and if the user
 * is registered with email and hence can author boards; 
 * otherwise redirects user to a new auth flow in /start
 */
export class AnonGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(): true | UrlTree {
    const currentUser = JSON.parse(sessionStorage.getItem("user"));
    const canAccessBoardList = currentUser && !currentUser.isAnonymous;

    if (canAccessBoardList) {
      return true;
    }

    return this.router.parseUrl("/start");
  }
}
