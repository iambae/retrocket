import { Component, OnInit, OnDestroy } from "@angular/core";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
})
export class LoginComponent implements OnInit, OnDestroy {
  constructor() {}

  ngOnInit() {
    var html = document.getElementsByTagName("html")[0];
    html.classList.add("login-layout");
    var body = document.getElementsByTagName("body")[0];
    body.classList.add("bg-default");
  }

  ngOnDestroy() {
    var html = document.getElementsByTagName("html")[0];
    html.classList.remove("login-layout");
    var body = document.getElementsByTagName("body")[0];
    body.classList.remove("bg-default");
  }
}
