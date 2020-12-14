import { Component, OnInit } from "@angular/core";
import { TeamService } from "src/app/services/team.service";
import { Observable } from "rxjs";
import { map as rxMap } from "rxjs/operators";

@Component({
  selector: "app-team",
  templateUrl: "./team.component.html",
})
export class TeamComponent implements OnInit {
  boardId: string;
  members$: Observable<string[]>;

  constructor(private teamService: TeamService) {
    this.boardId = window.location.pathname.split("/board/")[1];
  }

  ngOnInit() {
    this.members$ = this.teamService
      .getTeam(this.boardId)
      .pipe(rxMap((team) => team.members));
  }
}
