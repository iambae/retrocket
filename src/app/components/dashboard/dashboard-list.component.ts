import { Router } from "@angular/router";
import { AuthService } from "src/app/services/auth.service";
import { Component, OnInit } from "@angular/core";
import { BoardService } from "src/app/services/board.service";
import { Board } from "src/app/models";
import { switchMap } from "rxjs/operators";
import { Observable } from "rxjs";

@Component({
  selector: "app-dashboard-list",
  templateUrl: "./dashboard-list.component.html",
})
export class DashboardListComponent implements OnInit {
  boards$: Observable<Board[]>;

  constructor(
    private boardService: BoardService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.boards$ = this.authService.user.pipe(
      switchMap((user) => this.boardService.getBoards(user.uid))
    );
  }

  openBoard(id: string) {
    this.router.navigate(["/boards", id]);
  }

  // TODO: Implement
  create(name: string) {
    // this.boardService.createBoard({ name }).subscribe(data => {
    //   console.log('New board generated!');
    // });
  }
}
