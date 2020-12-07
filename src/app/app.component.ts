import { Component, HostListener } from "@angular/core";
import { BoardService } from "./services/board.service";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
})
export class AppComponent {
  title = "retrocket";

  /* Remove user from team of users accessing the board */
  @HostListener("window:beforeunload", ["$event"])
  public beforeunloadHandler() {
    const currentUser = JSON.parse(localStorage.getItem("user"));
    if (currentUser)
      this.boardService.updateBoardTeam(currentUser.lastJoined, {
        type: "remove",
        member: currentUser.displayName,
      });

    localStorage.removeItem("user");
  }

  constructor(private boardService: BoardService) {}
}
