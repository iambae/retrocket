import { Component, OnDestroy, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { switchMap } from "rxjs/operators";
import { Subscription } from "rxjs";
import { AuthService } from "src/app/services/auth.service";
import { BoardService } from "src/app/services/board.service";
import { Board } from "src/app/models";
import { Router } from "@angular/router";
import { DialogComponent } from "../dialog/dialog.component";

@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["dashboard.component.scss"],
})
export class DashboardComponent implements OnInit, OnDestroy {
  userId: string;
  boards: Board[];
  boardSubscription: Subscription;

  constructor(
    private boardService: BoardService,
    private authService: AuthService,
    private router: Router,
    public dialog: MatDialog
  ) {}

  ngOnInit() {
    this.boardSubscription = this.authService.user
      .pipe(
        switchMap((user) => {
          this.userId = user.uid;
          return this.boardService.getBoards(this.userId);
        })
      )
      .subscribe((boards) => (this.boards = boards));
  }

  openDialog() {
    this.dialog
      .open(DialogComponent, {
        width: "300px",
        data: {
          function: "Create",
          title: "Create new session",
          name: "",
          memo: "",
        },
      })
      .afterClosed()
      .subscribe((result) => {
        if (result) this.addBoard(result);
      });
  }

  addBoard({ name, memo }) {
    const board = {
      author: this.userId,
      name,
      memo,
      team: [],
      color: "#fb6340", // default color: Orange
    };
    this.boardService.addBoard(board);
  }

  onClickSignout() {
    this.authService.logout().then(async () => {
      this.router.navigate(["/start"]);
    });
  }

  ngOnDestroy() {
    this.boardSubscription.unsubscribe();
  }
}
