import { Component } from "@angular/core";
import {
  FormGroup,
  Validators,
  FormControl,
  ValidationErrors,
} from "@angular/forms";
import { Router } from "@angular/router";
import { AuthService } from "src/app/services/auth.service";
import { quotes } from "../../../assets/data/quotes.js";

@Component({
  selector: "app-auth",
  templateUrl: "./auth.component.html",
  styleUrls: ["./auth.component.scss"],
})
export class AuthComponent {
  form: FormGroup;
  formId: number = 0;
  loggedIn: boolean;
  isAuthor: boolean;
  quote: { author: string; text: string };

  constructor(public authService: AuthService, private router: Router) {
    this.form = new FormGroup({
      email: new FormControl("", [
        Validators.required,
        Validators.email,
        Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}$"),
      ]),
      password: new FormControl("", Validators.required),
      repeatPassword: new FormControl("", Validators.required),
    });
    this.form.setValidators(this.checkPasswords());
    this.quote = quotes[Math.floor(Math.random() * quotes.length)];
    this.isAuthor =
      !!localStorage.getItem("user") &&
      !JSON.parse(localStorage.getItem("user")).isAnonymous;
  }

  checkPasswords() {
    return (group: FormGroup): ValidationErrors => {
      const password = group.controls["password"];
      const repeatPassword = group.controls["repeatPassword"];

      if (password.value !== repeatPassword.value) {
        repeatPassword.setErrors({ notEquivalent: true });
      } else {
        repeatPassword.setErrors(null);
      }
      return;
    };
  }

  get isReady(): boolean {
    switch (this.formId) {
      case 0:
        return (
          this.email.status === "VALID" && this.password.status === "VALID"
        );
      case 1:
        return (
          this.email.status === "VALID" &&
          this.password.status === "VALID" &&
          this.repeatPassword.status === "VALID"
        );
      case 2:
        return this.email.status === "VALID";
      default:
        return true;
    }
  }

  get email() {
    return this.form.get("email");
  }

  get password() {
    return this.form.get("password");
  }

  get repeatPassword() {
    return this.form.get("repeatPassword");
  }

  onFormSubmit() {
    const { email, password } = this.form.value;

    switch (this.formId) {
      case 0: // sign in form
        this.authService
          .login(email, password)
          .then(() => this.router.navigate(["/boards"]));
        break;
      case 1: // sign up form
        this.authService
          .signup(email, password)
          .then(() => this.router.navigate(["/boards"]));
        break;
      case 2: // password reset form
        this.authService.resetPassword(email);
        break;
    }

    this.form.reset();
  }

  onClickLogout() {
    this.authService.logout().then(() => (this.isAuthor = false));
  }
}
