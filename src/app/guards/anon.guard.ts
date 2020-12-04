import { Injectable } from "@angular/core";
import { CanActivate, Router, UrlTree } from "@angular/router";

@Injectable({
  providedIn: "root",
})
export class AnonGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(): true | UrlTree {
    const currentUser = JSON.parse(localStorage.getItem("user"));
    const canAccessBoardList = currentUser && !currentUser.isAnonymous;

    if (canAccessBoardList) {
      return true;
    }

    return this.router.parseUrl("/start");
  }
}
