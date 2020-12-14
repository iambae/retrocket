import { AuthService } from "src/app/services/auth.service";
import { Component, OnInit, OnDestroy } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import {
  distinctUntilChanged,
  debounceTime,
  withLatestFrom,
  map as rxMap,
  filter,
} from "rxjs/operators";
import { TeamService } from "src/app/services/team.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-join",
  templateUrl: "./join.component.html",
  styleUrls: ["join.component.scss"],
})
export class JoinComponent implements OnInit, OnDestroy {
  boardId: string;
  username: string = "";
  usernameTaken: boolean = false;
  avatarReady: boolean = false;
  avatarUrl: string = "";
  userReady$: Observable<boolean>;
  usernameSubject = new BehaviorSubject(this.username);

  constructor(
    private authService: AuthService,
    private teamService: TeamService,
    private router: Router
  ) {}

  ngOnInit() {
    this.boardId = window.location.pathname.split("/join/")[1];

    // If user already joined this board, exit join flow
    let lastUser = JSON.parse(sessionStorage.getItem("user"));
    if (lastUser) this.router.navigate(["/board", lastUser.lastJoined]);

    this.userReady$ = this.usernameSubject.pipe(
      filter((username) => username.length > 0),
      debounceTime(700),
      distinctUntilChanged(),
      withLatestFrom(this.teamService.getTeam(this.boardId)),
      rxMap(([username, team]) => {
        this.avatarUrl = `https://robohash.org/${username}.png?set=set3`;
        this.usernameTaken = team.members.includes(username);
        return !this.usernameTaken;
      })
    );
  }

  onUsernameInput(name: string) {
    this.usernameSubject.next(name);
  }

  async joinBoard() {
    this.removeCurrentUser();

    const user = await this.authService.signInAnonymously(
      this.username,
      this.avatarUrl
    );

    const res = await this.teamService.updateTeam(this.boardId, {
      type: "add",
      member: user.displayName,
    });

    if (res) {
      user.lastJoined = this.boardId; // capture board to local user obj
      sessionStorage.setItem("user", JSON.stringify(user));
      this.router.navigate(["/board", this.boardId]);
      this.usernameSubject.complete();
    }
  }

  removeCurrentUser() {
    const currentUser = JSON.parse(sessionStorage.getItem("user"));

    if (currentUser)
      this.teamService.updateTeam(currentUser.lastJoined, {
        type: "remove",
        member: currentUser.displayName,
      });
  }

  ngOnDestroy() {
    this.usernameSubject.unsubscribe();
  }
}
