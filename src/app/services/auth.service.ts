import { Injectable } from "@angular/core";
import { AngularFireAuth } from "@angular/fire/auth";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  public user: Observable<firebase.User>;

  constructor(private afAuth: AngularFireAuth) {
    this.user = this.afAuth.authState;
  }

  async signup(email: string, password: string): Promise<firebase.User> {
    try {
      const value = await this.afAuth.createUserWithEmailAndPassword(
        email,
        password
      );
      console.log("Email and password signup success!", value.user);
      const userData = JSON.parse(JSON.stringify(value.user));
      const user = {
        email: userData.email,
        isAnonymous: userData.isAnonymous,
        uid: userData.uid,
        displayName: "",
        photoURL: "",
      };
      sessionStorage.setItem("user", JSON.stringify(user));
      return value.user;
    } catch (err) {
      console.error("Something went wrong during signup:", err);
    }
  }

  async login(email: string, password: string): Promise<firebase.User> {
    try {
      const value = await this.afAuth.signInWithEmailAndPassword(
        email,
        password
      );

      console.log("Email and password signin success!", value.user);

      const userData = JSON.parse(JSON.stringify(value.user));
      const user = {
        email: userData.email,
        isAnonymous: userData.isAnonymous,
        uid: userData.uid,
        displayName: "",
        photoURL: "",
      };

      sessionStorage.setItem("user", JSON.stringify(user));
      return value.user;
    } catch (err) {
      console.error("Something went wrong during email+pw signin:", err);
    }
  }

  async signInAnonymously(username: string, avatarUrl: string): Promise<any> {
    try {
      const value = await this.afAuth.signInAnonymously();

      // Deep clone value.user object ignoring internal properties
      const userData = JSON.parse(JSON.stringify(value.user));
      const user = {
        email: userData.email,
        isAnonymous: userData.isAnonymous,
        displayName: username,
        photoURL: avatarUrl,
        uid: userData.uid,
        lastJoined: "",
      };

      console.log("Anonymous signin success!", user);
      sessionStorage.setItem("user", JSON.stringify(user));
      return user;
    } catch (err) {
      console.error("Something went wrong during anonymous signin:", err);
    }
  }

  async logout() {
    try {
      const user = JSON.parse(sessionStorage.getItem("user"));
      sessionStorage.removeItem("user");
      await this.afAuth.signOut();
      return user;
    } catch (err) {
      console.error("Something went wrong during logout:", err);
    }
  }

  resetPassword(email: string) {
    const actionCodeSettings = {
      url: "https://retrocket-app.firebaseapp.com/start",
      handleCodeInApp: true,
    };

    this.afAuth
      .sendPasswordResetEmail(email, actionCodeSettings)
      .then(() => {
        console.log("Password reset email sent.");
      })
      .catch((error) => {
        console.log("Error occurred. Inspect error.code.", error);
      });
  }
}
