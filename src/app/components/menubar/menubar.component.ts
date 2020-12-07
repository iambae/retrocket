import { Component, Input, Output, EventEmitter } from "@angular/core";
import { AuthService } from "src/app/services/auth.service";
import { Color } from "../../models/index";
import { Router } from "@angular/router";
import { DialogComponent } from "../dialog/dialog.component";
import { MatDialog } from "@angular/material/dialog";

@Component({
  selector: "app-menubar",
  templateUrl: "./menubar.component.html",
  styleUrls: ["./menubar.component.scss"],
})
export class MenubarComponent {
  user: any;
  @Input() team: string[];
  @Input() color: Color;
  @Input() colors: Color[];
  @Input() boardId: string;
  @Input() boardName: string;
  @Output() boardUpdate: EventEmitter<any> = new EventEmitter<any>();

  constructor(
    public authService: AuthService,
    private router: Router,
    public dialog: MatDialog
  ) {
    this.user = JSON.parse(localStorage.getItem("user"));
  }

  toggleColor(color: Color) {
    this.boardUpdate.emit({ field: "color", value: color.value });
  }

  editBoardName(name: string) {
    this.boardUpdate.emit({ field: "name", value: name });
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
    this.authService.logout().then(async () => {
      this.boardUpdate.emit({ field: "team", value: this.user.displayName });
      this.router.navigate(["/start"]);
    });
  }
}
