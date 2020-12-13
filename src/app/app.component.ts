import { Component, HostListener } from "@angular/core";
import { TeamService } from "./services/team.service";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
})
export class AppComponent {
  title = "retrocket";

  /* Remove user from team of users accessing the board */
  @HostListener("window:beforeunload", ["$event"])
  public beforeunloadHandler() {
    const currentUser = JSON.parse(sessionStorage.getItem("user"));
    if (currentUser)
      this.teamService.updateTeam(currentUser.lastJoined, {
        type: "remove",
        member: currentUser.displayName,
      });

    sessionStorage.removeItem("user");
  }

  constructor(private teamService: TeamService) {}
}
