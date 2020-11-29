import { Router } from "@angular/router";
import { Injectable } from "@angular/core";
import { AngularFireAuth } from "@angular/fire/auth";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  user: Observable<firebase.User>;

  constructor(private afAuth: AngularFireAuth, private router: Router) {
    this.user = this.afAuth.authState;
  }

  signup(email: string, password: string) {
    this.afAuth
      .createUserWithEmailAndPassword(email, password)
      .then((value) => {
        console.log("Success!", value);
        this.router.navigate(["dashboard-list"]);
      })
      .catch((err) => {
        console.log("Something went wrong during signup:", err);
      });
  }

  login(email: string, password: string) {
    this.afAuth
      .signInWithEmailAndPassword(email, password)
      .then((value) => {
        console.log("Success!", value);
        localStorage.setItem("user", JSON.stringify(value.user));
        this.router.navigate(["/boards"]);
      })
      .catch((err) => {
        console.log("Something went wrong during email+pw signin:", err);
      });
  }

  signInAnonymously(username: string, avatarUrl: string, redirectUrl: string) {
    this.afAuth
      .signInAnonymously()
      .then((data) => {
        // Deep clone data.user object ignoring internal properties
        const user = {
          ...JSON.parse(JSON.stringify(data.user)),
          displayName: username,
          photoURL: avatarUrl,
        };

        localStorage.setItem("user", JSON.stringify(user));
        console.log("Anonymous signin success!", user);
        this.router.navigate(["/boards", redirectUrl]);
      })
      .catch((err) => {
        console.log("Something went wrong during anonymous signin:", err);
      });
  }

  logout() {
    this.afAuth.signOut();
    localStorage.removeItem("user");
    this.router.navigate(["/login"]);
  }
}
