import { FormGroup, FormControl, Validators } from "@angular/forms";
import { Component } from "@angular/core";
import { AuthService } from "../../services/auth.service";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
})
export class LoginComponent {
  loginForm: FormGroup;
  submitted: boolean = false;

  constructor(public authService: AuthService) {
    this.loginForm = new FormGroup({
      email: new FormControl("", [
        Validators.required,
        Validators.email,
        Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}$"),
      ]),
      password: new FormControl("", Validators.required),
    });
  }

  get email() {
    return this.loginForm.get("email");
  }

  get password() {
    return this.loginForm.get("password");
  }

  onFormSubmit() {
    if (this.loginForm.invalid) return;
    this.submitted = true;
    const { email, password } = this.loginForm.value;
    this.authService.login(email, password);
    this.loginForm.reset();
  }
}
