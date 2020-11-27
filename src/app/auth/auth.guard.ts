import { Injectable } from "@angular/core";
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Data,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from "@angular/router";
import { AuthService } from "./auth.service";

@Injectable({
  providedIn: "root",
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): true | UrlTree {
    return this.checkLogin(route.data, state.url);
  }

  checkLogin(data: Data, url: string): true | UrlTree {
    if (this.authService.isAuthenticated()) {
      if (data?.redirectToBoards) {
        // User navigated to login page when already logged in. Redirect to boards
        return this.router.parseUrl("/boards");
      }
      return true;
    }

    this.authService.redirectUrl = url;
    return this.router.parseUrl("/login");
  }
}
