import { AuthService } from "src/app/services/auth.service";
import { Component, OnInit, OnDestroy } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import {
  distinctUntilChanged,
  debounceTime,
  withLatestFrom,
  map as rxMap,
} from "rxjs/operators";
import { BoardService } from "src/app/services/board.service";
import { Router } from "@angular/router";
import { ThrowStmt } from "@angular/compiler";

@Component({
  selector: "app-join",
  templateUrl: "./join.component.html",
  styles: [
    `
      p.status {
        margin-top: 20px;
      }

      img.loading {
        padding: 60px;
        text-align: center;
        margin: auto;
      }

      div.card-body {
        justify-content: center;
        align-items: center;
        display: grid;
        text-align: center;
      }

      div.input-container {
        padding: 5px;
        background-color: white;
      }

      input {
        width: 100%;
        border: none;
        border-radius: 1.3rem;
      }
    `,
  ],
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
    this.userReady$ = this.usernameSubject.pipe(
      debounceTime(700),
      distinctUntilChanged(),
      withLatestFrom(this.boardService.getBoardTeam(this.boardId)),
      rxMap(([username, team]) => {
        this.isLoading = true;
        this.avatarUrl =
          username.length > 0
            ? `https://robohash.org/${username}.png?set=set3`
            : "";
        this.usernameTaken = team.includes(username.toLowerCase());
        return !this.usernameTaken;
      })
    );
  }

  onUsernameInput(name: string) {
    this.usernameSubject.next(name);
  }

  joinBoard() {
    this.authService
      .signInAnonymously(this.username, this.avatarUrl)
      .then((user) => {
        this.boardService.updateBoardTeam(this.boardId, {
          type: "add",
          member: user.displayName,
        });
        this.router.navigate(["/board", this.boardId]);
        this.usernameSubject.complete();
      });
  }

  ngOnDestroy() {
    this.usernameSubject.unsubscribe();
  }
}
