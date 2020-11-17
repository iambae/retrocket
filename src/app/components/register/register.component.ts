import { FormGroup, FormControl, Validators } from "@angular/forms";
import { Component } from "@angular/core";
import { AuthService } from "src/app/services/auth.service";

@Component({
  selector: "app-register",
  templateUrl: "./register.component.html",
})
export class RegisterComponent {
  registerForm: FormGroup;
  submitted: boolean = false;

  constructor(public authService: AuthService) {
    this.registerForm = new FormGroup({
      email: new FormControl("", [
        Validators.required,
        Validators.email,
        Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}$"),
      ]),
      password: new FormControl("", Validators.required),
    });
  }

  get email() {
    return this.registerForm.get("email");
  }

  get password() {
    return this.registerForm.get("password");
  }

  onFormSubmit() {
    if (this.registerForm.invalid) return;
    this.submitted = true;
    const { email, password } = this.registerForm.value;
    this.authService.signup(email, password);
    this.registerForm.reset();
  }
}
