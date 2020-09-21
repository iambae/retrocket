import { Component, OnInit, OnDestroy } from "@angular/core";
import { Router } from "@angular/router";

@Component({
  selector: "app-login-layout",
  templateUrl: "./login-layout.component.html",
})
export class LoginLayoutComponent implements OnInit, OnDestroy {
  test: Date = new Date();
  public isCollapsed = true;

  constructor(private router: Router) {}

  ngOnInit() {
    var html = document.getElementsByTagName("html")[0];
    html.classList.add("login-layout");
    var body = document.getElementsByTagName("body")[0];
    body.classList.add("bg-default");
    this.router.events.subscribe((event) => {
      this.isCollapsed = true;
    });
  }
  ngOnDestroy() {
    var html = document.getElementsByTagName("html")[0];
    html.classList.remove("login-layout");
    var body = document.getElementsByTagName("body")[0];
    body.classList.remove("bg-default");
  }
}
