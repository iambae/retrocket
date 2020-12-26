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
  currentUser: any;
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
	this.currentUser = JSON.parse(sessionStorage.getItem("user"));
	// If user already joined this board, exit join flow and redirect
    if (this.currentUser) this.router.navigate(["/board", this.currentUser.team]);

    this.userReady$ = this.usernameSubject.pipe(
      filter((username) => username.length > 0),
      debounceTime(700),
      distinctUntilChanged(),
      withLatestFrom(this.teamService.getTeam(this.boardId)),
      rxMap(([username, team]) => {
		  // set1: robots with bodies, set2: monsters, set4: cats
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
      user.team = this.boardId; // save boardId to user data in session storage
      sessionStorage.setItem("user", JSON.stringify(user));
      this.router.navigate(["/board", this.boardId]);
      this.usernameSubject.complete();
    }
  }

  removeCurrentUser() {    
	if (this.currentUser)
      this.teamService.updateTeam(this.currentUser.team, {
        type: "remove",
        member: this.currentUser.displayName,
      });
  }

  ngOnDestroy() {
    this.usernameSubject.unsubscribe();
  }
}
