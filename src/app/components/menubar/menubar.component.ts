import { Component, Input, Output, EventEmitter } from "@angular/core";
import { AuthService } from "src/app/auth/auth.service";
import { Color } from "../../models/index";

@Component({
  selector: "app-menubar",
  templateUrl: "./menubar.component.html",
  styles: [
    `
      .board-name {
        display: flex;
        float: right;
        margin-left: auto;
        margin-right: 25px;
        align-items: center;
      }

      .board-name input {
        color: #525f7f;
        font-style: oblique;
        font-size: 2rem;
        font-family: "aventraregular";
        text-transform: uppercase;
        width: 100%;
        padding: 0.5rem;
        border: none;
        border-bottom: transparent 3px solid;
        outline: 0;
        transition: 0.35s ease;
      }

      .board-name input:hover,
      .board-name input:focus {
        background-color: #f1f1f1;
        border-bottom: #ddd 3px dotted;
      }

      .board-name:after {
        position: absolute;
        top: 1rem;
        left: 0.5rem;
        color: gray;
      }

      .board-name div {
        float: left;
      }

      .navbar-horizontal .navbar-nav .nav-link {
        font-weight: 700;
      }
    `,
  ],
})
export class MenubarComponent {
  @Input() color: Color;
  @Input() colors: Color[];
  @Input() boardName: string;
  @Output() boardUpdate: EventEmitter<any> = new EventEmitter<any>();

  constructor(public authService: AuthService) {}

  toggleColor(color: Color) {
    this.boardUpdate.emit({ field: "color", value: color.value });
  }

  editBoardName(name: string) {
    this.boardUpdate.emit({ field: "name", value: name });
  }

  onClickShare() {}

  onClickLogout() {
    this.authService
      .logout()
      .then((res) => console.log(res))
      .catch((err) => console.log(err));
  }
}
