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
        console.log("Something went wrong:", err);
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
        console.log("Something went wrong:", err);
      });
  }

  async logout(): Promise<boolean> {
    try {
      await this.afAuth.signOut();
      localStorage.removeItem("user");
      return await this.router.navigate(["/login"]);
    } catch (err) {
      return err;
    }
  }
}
