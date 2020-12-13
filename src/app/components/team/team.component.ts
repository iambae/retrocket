import { Component, OnInit, Input } from "@angular/core";
import { TeamService } from "src/app/services/team.service";
import { Observable } from "rxjs";
import { map as rxMap } from "rxjs/operators";

@Component({
  selector: "app-team",
  templateUrl: "./team.component.html",
})
export class TeamComponent implements OnInit {
  @Input() boardId: string;
  members$: Observable<string[]>;

  constructor(private teamService: TeamService) {}

  ngOnInit() {
    this.members$ = this.teamService
      .getTeam(this.boardId)
      .pipe(rxMap((team) => team.members));
  }
}
