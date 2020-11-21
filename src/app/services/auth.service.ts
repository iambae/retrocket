import { Router } from "@angular/router";
import { Injectable } from "@angular/core";
import { AngularFireAuth } from "@angular/fire/auth";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  user: Observable<firebase.User>;

  constructor(private firebaseAuth: AngularFireAuth, private router: Router) {
    this.user = firebaseAuth.user;
  }

  signup(email: string, password: string) {
    this.firebaseAuth
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
    this.firebaseAuth
      .signInWithEmailAndPassword(email, password)
      .then((value) => {
        console.log("Success!", value);
        this.router.navigate(["dashboard-list"]);
      })
      .catch((err) => {
        console.log("Something went wrong:", err);
      });
  }

  logout() {
    this.firebaseAuth.signOut();
  }
}
