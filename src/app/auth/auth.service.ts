import { Router } from "@angular/router";
import { Injectable } from "@angular/core";
import { AngularFireAuth } from "@angular/fire/auth";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  user: Observable<firebase.User>;
  redirectUrl: string;

  constructor(private afAuth: AngularFireAuth, private router: Router) {
    this.user = afAuth.user;
  }

  isAuthenticated(): boolean {
    return this.user !== null;
  }

  signup(email: string, password: string) {
    this.afAuth
      .createUserWithEmailAndPassword(email, password)
      .then((value) => {
        console.log("Success!", value);
        this.router.navigate(["dashboard-list"]);
      })
      .catch((err) => {
        console.log("Something went wrong:", err);
      });
  }

  login(email: string, password: string) {
    this.afAuth
      .signInWithEmailAndPassword(email, password)
      .then((value) => {
        console.log("Success!", value);
        this.router.navigate(["/boards"]);
      })
      .catch((err) => {
        console.log("Something went wrong:", err);
      });
  }

  logout(): Promise<void> {
    return this.afAuth.signOut();
  }
}
