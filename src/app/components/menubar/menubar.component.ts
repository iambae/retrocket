import { Component, Input, Output, EventEmitter } from "@angular/core";
import { Router } from "@angular/router";
import { AuthService } from "src/app/auth/auth.service";
import { Color } from "../../models/index";

@Component({
  selector: "app-menubar",
  templateUrl: "./menubar.component.html",
})
export class MenubarComponent {
  @Input() color: Color;
  @Input() colors: Color[];
  @Output() colorChange: EventEmitter<Color> = new EventEmitter<Color>();

  constructor(private router: Router, public authService: AuthService) {}

  onColorChange(color: Color) {
    this.colorChange.emit(color);
  }

  onClickLogout() {
    this.authService.logout().then(() => this.router.navigate(["/login"]));
  }
}
