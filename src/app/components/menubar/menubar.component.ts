import { TeamService } from "./../../services/team.service";
import { Component, Input } from "@angular/core";
import { AuthService } from "src/app/services/auth.service";
import { Color } from "../../models/index";
import { Router } from "@angular/router";
import { DialogComponent } from "../dialog/dialog.component";
import { MatDialog } from "@angular/material/dialog";
import { BoardService } from "src/app/services/board.service";

@Component({
  selector: "app-menubar",
  templateUrl: "./menubar.component.html",
  styleUrls: ["./menubar.component.scss"],
})
export class MenubarComponent {
  user: any;
  @Input() color: Color;
  @Input() colors: Color[];
  @Input() boardId: string;
  @Input() boardName: string;

  constructor(
    public authService: AuthService,
    private teamService: TeamService,
    private boardService: BoardService,
    private router: Router,
    public dialog: MatDialog
  ) {
    this.user = JSON.parse(sessionStorage.getItem("user"));
  }

  updateBoardColor(color: Color) {
    this.boardService.updateBoard(this.boardId, { color: color.value });
  }

  updateBoardName(name: string) {
    this.boardService.updateBoard(this.boardId, { name: name });
  }

  onClickShare() {
    this.dialog
      .open(DialogComponent, {
        width: "500px",
        data: {
          function: "Share",
          title: "Share this board",
          copyUrl: `http://localhost:4200/join/${this.boardId}`,
        },
      })
      .afterClosed();
  }

  onClickLogout() {
    this.authService.logout().then(() => {
      this.teamService.updateTeam(this.boardId, {
        type: "remove",
        member: this.user.displayName,
      });
      this.router.navigate(["/start"]);
    });
  }
}
