import { Component, EventEmitter, Input, Output } from "@angular/core";
import { Color } from "../../../models/index";

@Component({
  selector: "app-menu",
  templateUrl: "./menu.component.html",
})
export class MenuComponent {
  @Input() colors: Color[];
  @Output() colorChange: EventEmitter<Color> = new EventEmitter<Color>();
  @Input("color") selectedColor: Color;

  constructor() {}

  switchColor(color: Color) {
    this.selectedColor = color;
    this.colorChange.emit(color);
  }

  getColor(bgColor: string, textColor: string) {
    return {
      "background-color": bgColor,
      color: textColor,
    };
  }
}
