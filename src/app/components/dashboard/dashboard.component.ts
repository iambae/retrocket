import { Component, OnDestroy, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { switchMap } from "rxjs/operators";
import { Subscription } from "rxjs";
import { AuthService } from "src/app/services/auth.service";
import { BoardService } from "src/app/services/board.service";
import { Board } from "src/app/models";
import { Router } from "@angular/router";
import { DialogComponent } from "../dialog/dialog.component";
import { TeamService } from "src/app/services/team.service";
import { ColumnService } from "src/app/services/column.service";

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
    private teamService: TeamService,
    private columnService: ColumnService,
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
		  // Result: { name: string, memo: string }
        if (result) this.addBoard(result);
      });
  }

  addBoard({ name, memo }) {
    const board = {
      author: this.userId,
      color: "#fb6340", // default: Orange
      columns: this.columnService.getDefaultNames(),
      name,
      memo,
    };
	const boardId = this.boardService.addBoard(board);
	
	// POST a Team document for the new board
    this.teamService.createTeam(boardId);
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
