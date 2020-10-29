import { Component, OnInit } from "@angular/core";

declare interface RouteInfo {
  path: string;
  title: string;
  icon: string;
  class: string;
}
export const ROUTES: RouteInfo[] = [
  {
    path: "/dashboard",
    title: "Dashboard",
    icon: "fas fa-columns text-primary",
    class: "",
  },
  { path: "/login", title: "Login", icon: "fas fa-key text-info", class: "" },
];

@Component({
  selector: "app-menubar",
  templateUrl: "./menubar.component.html",
})
export class MenubarComponent implements OnInit {
  public menuItems: any[];

  constructor() {}

  ngOnInit() {
    this.menuItems = ROUTES.filter((menuItem) => menuItem);
  }
}
