import { ColorService } from "src/app/services/color.service";
import { BoardService } from "src/app/services/board.service";
import { Observable } from "rxjs";
import { map as rxMap, withLatestFrom } from "rxjs/operators";
import { Component, OnInit } from "@angular/core";
import { Card, Column, Board, Color } from "src/app/models/index";
import { ColumnService } from "src/app/services/column.service";
import { CardService } from "src/app/services/card.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  providers: [BoardService],
})
export class DashboardComponent implements OnInit {
  boardId: string;
  board$: Observable<Board>;
  cards: any = {};
  columns$: Observable<Column[]>;
  color$: Observable<Color>;
  colors$: Observable<Color[]>;

  constructor(
    private boardService: BoardService,
    private cardService: CardService,
    private colorService: ColorService,
    private columnService: ColumnService,
    private router: Router
  ) {}

  ngOnInit() {
    const currentUser = JSON.parse(localStorage.getItem("user"));
    this.boardId = window.location.pathname.split("/board/")[1];
    this.board$ = this.boardService.getBoard(this.boardId).pipe(
      rxMap((board) => {
        currentUser.uid === board.author ||
        board.team.includes(currentUser.displayName)
          ? this.initBoard(board)
          : this.router.navigate(["/join", board.id]);
        return board;
      })
    );
  }

  initBoard(board: Board) {
    this.colors$ = this.colorService.getColors();
    this.color$ = this.colorService.getColor(board.color).pipe(
      withLatestFrom(this.colors$),
      rxMap(([selectedColor, colors]) =>
        colors.find((color) => selectedColor.id === color.id)
      )
    );
    this.columns$ = this.columnService.getColumns();
    this.cardService
      .getCards(this.boardId)
      .pipe(
        withLatestFrom(this.columns$),
        rxMap(([cards, columns]) => {
          for (const column of columns)
            this.cards[column.order] = cards
              .filter((card: Card) => card.colId === column.id)
              .sort((a, b) => a.order - b.order);
        })
      )
      .subscribe();
  }

  updateBoard({ field, value }) {
    if (field === "team")
      this.boardService.updateBoardTeam(this.boardId, {
        type: "remove",
        member: value,
      });
    else this.boardService.updateBoard(this.boardId, { [field]: value });
  }

  handleCardEvent(event: { type: string; data: Card }) {
    switch (event.type) {
      case "add":
        this.cardService.addCard(event.data, this.boardId);
        break;
      case "update":
        this.cardService.updateCard(event.data, this.boardId);
        break;
      case "delete":
        this.cardService.deleteCard(event.data, this.boardId);
    }
  }
}
