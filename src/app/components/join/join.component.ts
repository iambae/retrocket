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
import { BoardService } from "src/app/services/board.service";
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
  isLoading: boolean = false;
  avatarUrl: string = "";
  userReady$: Observable<boolean>;
  usernameSubject = new BehaviorSubject(this.username);

  constructor(
    private authService: AuthService,
    private boardService: BoardService,
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
      withLatestFrom(this.boardService.getBoardTeam(this.boardId)),
      rxMap(([username, team]) => {
        this.avatarUrl = `https://robohash.org/${username}.png?set=set3`;
        this.usernameTaken = team.includes(username);
        return !this.usernameTaken;
      })
    );
  }

  onUsernameInput(name: string) {
    this.usernameSubject.next(name);
  }

  async joinBoard() {
    await this.removeCurrentUser();

    this.authService
      .signInAnonymously(this.username, this.avatarUrl)
      .then(async (newUser) => {
        await this.boardService.updateBoardTeam(this.boardId, {
          type: "add",
          member: newUser.displayName,
        });
        newUser.lastJoined = this.boardId; // save this board to local user
        sessionStorage.setItem("user", JSON.stringify(newUser));
        this.router.navigate(["/board", this.boardId]);
        this.usernameSubject.complete();
      });
  }

  async removeCurrentUser() {
    const currentUser = JSON.parse(sessionStorage.getItem("user"));
    if (currentUser)
      await this.boardService.updateBoardTeam(currentUser.lastJoined, {
        type: "remove",
        member: currentUser.displayName,
      });
  }

  ngOnDestroy() {
    this.usernameSubject.unsubscribe();
  }
}
