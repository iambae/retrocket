import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from "@angular/router";

@Injectable({
  providedIn: "root",
})
/**
 * Allows access to requested board if user data
 * exists in current session, otherwise redirects user
 * to JoinComponent to start join flow
 */
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): true | UrlTree {
	const isLoggedIn = JSON.parse(sessionStorage.getItem("user"));
	
    return isLoggedIn ? true : this.router.parseUrl(`/join/${route.params.id}`);
  }
}
