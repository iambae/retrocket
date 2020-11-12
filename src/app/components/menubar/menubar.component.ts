import { Component, OnInit } from "@angular/core";
import { Observable } from "rxjs";
import { map as rxMap } from "rxjs/operators";
import { RouteService } from "../../services/route.service";
import { Color, Route } from "../../models/index";
import { ColorService } from "../../services/color.service";

@Component({
  selector: "app-menubar",
  templateUrl: "./menubar.component.html",
})
export class MenubarComponent implements OnInit {
  public routes$: Observable<Route[]>;
  public colorOptions$: Observable<Color[]>;
  public selectedColor: Color;

  constructor(
    private routeService: RouteService,
    private colorService: ColorService
  ) {}

  ngOnInit() {
    this.routes$ = this.routeService.getRoutes();
    this.colorOptions$ = this.colorService.getColors().pipe(
      rxMap((colors: Color[]) => {
        this.selectedColor = colors[0];
        return colors;
      })
    );
  }

  // TODO: handler
  colorChangeHandler(option) {
    // this.colorService.switchColor(option);
  }
}
