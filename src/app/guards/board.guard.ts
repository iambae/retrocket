import { Injectable } from "@angular/core";
import { CanActivate, Router, ActivatedRouteSnapshot } from "@angular/router";
import { BoardService } from "../services/board.service";
import { map as rxMap } from "rxjs/operators";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class BoardGuard implements CanActivate {
  constructor(private router: Router, private boardService: BoardService) {}

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
    const boardId = route.params.id;
    return this.boardService.getBoard(boardId).pipe(
      rxMap((board) => {
		if (board) return true;
        else this.router.navigate(["/not-found"]);
      }));
  }
}
