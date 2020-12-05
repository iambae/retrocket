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
  selector: "app-dashboard-list",
  templateUrl: "./dashboard-list.component.html",
  styles: [
    `
      div.rt-table {
        margin-bottom: 20px;
        max-width: 90%;
        margin: auto;
      }

      .header-body {
        justify-content: center;
        display: flex;
      }

      h1 {
        color: white;
        font-size: xxx-large;
      }

      .btn {
        border-radius: 20px;
        margin-right: 10px;
        margin-left: 10px;
      }

      table {
        table-layout: fixed;
        width: 100%;
        white-space: nowrap;
      }

      .table-responsive {
        overflow-y: visible;
        overflow-x: visible;
      }
    `,
  ],
})
export class DashboardListComponent implements OnInit, OnDestroy {
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
        data: { title: "Create new session", name: "", memo: "" },
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
