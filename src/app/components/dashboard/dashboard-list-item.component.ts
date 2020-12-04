import {
  Component,
  ElementRef,
  Input,
  Renderer2,
  ViewChild,
  AfterViewInit,
} from "@angular/core";
import { Router } from "@angular/router";
import { Board } from "src/app/models";
import { BoardService } from "src/app/services/board.service";

@Component({
  selector: "[app-dashboard-list-item]",
  templateUrl: "./dashboard-list-item.component.html",
  styles: [
    `
      span.rt-span {
        border: none;
        background-color: transparent;
      }

      .dropdown-menu.show > .dropdown-item {
        margin-left: 0px;
      }

      .table td,
      .table th {
        font-size: 1rem;
      }

      td {
        white-space: normal;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      td.actions-menu {
        overflow: visible;
      }

      img.filter {
        filter: brightness(0) invert(1);
        height: 70%;
        width: 70%;
      }
    `,
  ],
})
export class DashboardListItemComponent implements AfterViewInit {
  @ViewChild("container") container: ElementRef;
  @ViewChild("content") content: ElementRef;

  isEditingMemo = false;
  memo: string;

  @Input() board: Board;

  constructor(
    private router: Router,
    private el: ElementRef,
    private renderer: Renderer2,
    private boardService: BoardService
  ) {}

  ngAfterViewInit() {
    this.saveSize();
  }

  onClickShare() {}

  onClickDelete() {
    this.boardService.deleteBoard(this.board.id);
  }

  canUpdateMemo() {
    return (
      this.memo && this.memo.trim() !== "" && this.memo !== this.board.memo
    );
  }

  saveSize() {
    if (this.content && this.container) {
      const height = `${this.content.nativeElement.offsetHeight}px`;
      this.renderer.setStyle(this.container.nativeElement, "height", height);
      const width = `${this.content.nativeElement.offsetWidth}px`;
      this.renderer.setStyle(this.container.nativeElement, "width", width);
    }
  }

  openBoard(id: string) {
    this.router.navigate(["/board", id]);
  }

  getDate(date): string {
    return date
      .toDate()
      .toString()
      .split(/^([^\r\n:]*:[^\r\n:]*).*/)[1];
  }

  onEditMemo(memo: string) {
    this.isEditingMemo = true;
    this.memo = memo;

    const textarea = this.el.nativeElement.getElementsByTagName("textarea")[0];

    setTimeout(function () {
      textarea.focus();
    }, 0);
  }

  onKeyDown(event: KeyboardEvent) {
    if (event.key === "Enter" && this.canUpdateMemo()) {
      this.updateMemo();
    } else if (event.key === "Escape") {
      this.cancelMemoEdit();
    }
  }

  onKeyUp(event: KeyboardEvent) {
    if (event.key !== "Enter" && event.key !== "Escape") {
      let cardInput = this.container.nativeElement;
      cardInput.style.overflow = "hidden";
      cardInput.style.height = "0px";
      cardInput.style.height = cardInput.scrollHeight + "px";
    }
  }

  onBlur() {
    if (this.canUpdateMemo()) {
      this.updateMemo();
      this.isEditingMemo = false;
    } else {
      this.cancelMemoEdit();
    }
  }

  updateMemo() {
    this.memo = this.memo.trim();
    this.boardService.updateBoard(this.board.id, { memo: this.memo });
    this.cancelMemoEdit();
  }

  cancelMemoEdit() {
    this.isEditingMemo = false;
    this.memo = "";
  }
}
