import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { Observable } from "rxjs";
import { RouteService } from "../../services/route.service";
import { Color, Route } from "../../models/index";

@Component({
  selector: "app-menubar",
  templateUrl: "./menubar.component.html",
})
export class MenubarComponent implements OnInit {
  @Input() color: Color;
  @Input() colors: Color[];
  @Output() colorChange: EventEmitter<Color> = new EventEmitter<Color>();
  routes$: Observable<Route[]>;

  constructor(private routeService: RouteService) {}

  ngOnInit() {
    this.routes$ = this.routeService.getRoutes();
  }

  onColorChange(color: Color) {
    this.colorChange.emit(color);
  }
}
