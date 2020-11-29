import { AuthService } from "src/app/auth/auth.service";
import { Component, OnInit, OnDestroy } from "@angular/core";
import { BehaviorSubject, Subscription } from "rxjs";
import { distinctUntilChanged, debounceTime } from "rxjs/operators";

@Component({
  selector: "app-join",
  templateUrl: "./join.component.html",
  styles: [
    `
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
  isLoading: boolean = true;
  avatarUrl: string = "";
  usernameSubject = new BehaviorSubject(this.username);
  usernameSubscription: Subscription;

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.boardId = window.location.pathname.split("/join/")[1];
    this.usernameSubscription = this.usernameSubject
      .pipe(debounceTime(500), distinctUntilChanged())
      .subscribe((username) => {
        this.isLoading = true;
        this.avatarUrl =
          username.length > 0
            ? `https://robohash.org/${username}.png?set=set3`
            : "";
      });
  }

  onUsernameInput(name: string) {
    this.usernameSubject.next(name);
  }

  onClickJoin() {
    this.authService.signInAnonymously(
      this.username,
      this.avatarUrl,
      this.boardId
    );
  }

  ngOnDestroy() {
    this.usernameSubscription.unsubscribe();
  }
}
