import { Component } from "@angular/core";
import {
  FormGroup,
  Validators,
  FormControl,
  ValidationErrors,
} from "@angular/forms";
import { Router } from "@angular/router";
import { AuthService } from "src/app/services/auth.service";
import { quotes } from "../../../assets/data/quotes";

@Component({
  selector: "app-auth",
  templateUrl: "./auth.component.html",
  styleUrls: ["./auth.component.scss"],
})
export class AuthComponent {
	// Shared by all three auth flows
  form: FormGroup; 
   // 0: signin, 1: signup, 2: reset
  formId: number = 0;
   // Used in view to display signout flow instead to authors
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
	
	// Anonymous users cannot author any boards
    this.isAuthor =
      !!sessionStorage.getItem("user") &&
      !JSON.parse(sessionStorage.getItem("user")).isAnonymous;
  }

  /* Form validator: check equality of password and repeat password. */
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

  /**  
   * Uniquely handles validation requirements of each auth flow.
   * @return {boolean} if current auth flow passes all validation checks.
   */
  get isReady(): boolean {
    switch (this.formId) {
      case 0: // signin form
        return (
          this.email.status === "VALID" && this.password.status === "VALID"
        );
      case 1: // signup form
        return (
          this.email.status === "VALID" &&
          this.password.status === "VALID" &&
          this.repeatPassword.status === "VALID"
        );
      case 2: // password reset form
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

    /**  
   * Navigates user to Dashboard after successful signin or signup.
   * Stays on page when password reset form is submitted.
   */
  onFormSubmit() {
    const { email, password } = this.form.value;

    switch (this.formId) {
      case 0:
        this.authService
          .login(email, password)
          .then(() => this.router.navigate(["/dashboard"]));
        break;
      case 1: 
        this.authService
          .signup(email, password)
          .then(() => this.router.navigate(["/dashboard"]));
        break;
      case 2:
        this.authService.resetPassword(email);
        break;
    }

    this.form.reset();
  }

  onClickLogout() {
    this.authService.logout().then(() => (this.isAuthor = false));
  }
}
