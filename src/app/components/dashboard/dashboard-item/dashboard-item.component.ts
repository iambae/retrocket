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
import { MatDialog } from "@angular/material/dialog";
import { DialogComponent } from "../../dialog/dialog.component";

@Component({
  selector: "[app-dashboard-item]",
  templateUrl: "./dashboard-item.component.html",
  styleUrls: ["dashboard-item.component.scss"],
})
export class DashboardItemComponent implements AfterViewInit {
  @ViewChild("container") container: ElementRef;
  @ViewChild("content") content: ElementRef;

  confirmDelete = false;
  isEditingMemo = false;
  memo: string;

  @Input() board: Board;

  constructor(
    private router: Router,
    private el: ElementRef,
    private renderer: Renderer2,
    public dialog: MatDialog,
    private boardService: BoardService
  ) {}

  ngAfterViewInit() {
    this.saveSize();
  }

  onClickShare() {
    this.dialog
      .open(DialogComponent, {
        width: "500px",
        data: {
          function: "Share",
          title: "Share this board",
          copyUrl: `http://localhost:4200/join/${this.board.id}`,
        },
      })
      .afterClosed();
  }

  onClickDelete() {
    this.dialog
      .open(DialogComponent, {
        width: "500px",
        data: {
          function: "Delete",
          title: "Delete this board?",
        },
      })
      .afterClosed()
      .subscribe((res) => {
        if (res === "Delete") this.boardService.deleteBoard(this.board.id);
      });
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
