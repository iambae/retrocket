import { ColorService } from "./../../services/color.service";
import { BoardService } from "src/app/services/board.service";
import { Observable } from "rxjs";
import { map as rxMap, switchMap, withLatestFrom } from "rxjs/operators";
import { Component, OnInit, OnDestroy } from "@angular/core";
import { Card, Column, Board, Color } from "src/app/models/index";
import { ColumnService } from "src/app/services/column.service";
import { CardService } from "src/app/services/card.service";

@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  providers: [BoardService],
})
export class DashboardComponent implements OnInit, OnDestroy {
  cards: any = {};
  color$: Observable<Color>;
  colors$: Observable<Color[]>;
  boardId: string;
  board$: Observable<Board>;
  columns$: Observable<Column[]>;

  constructor(
    private boardService: BoardService,
    private cardService: CardService,
    private colorService: ColorService,
    private columnService: ColumnService
  ) {}

  ngOnInit() {
    this.boardId = window.location.pathname.split("/boards/")[1];
    this.board$ = this.boardService.getBoard(this.boardId);

    this.colors$ = this.colorService.getColors();
    this.color$ = this.board$.pipe(
      switchMap((board) => this.colorService.getColor(board.colorId)),
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
            this.cards[column.order] = cards.filter(
              (card: Card) => card.colId === column.id
            );
        })
      )
      .subscribe();
  }

  updateColor(color: Color) {
    this.boardService.updateBoard(this.boardId, { colorId: color.id });
  }

  updateColumn(data: Column) {
    this.columnService.updateColumn(data);
  }

  handleCardEvent(event: { type: string; data: Card }) {
    switch (event.type) {
      case "add":
        this.cardService.addCard(event.data, this.boardId);
      case "update":
        this.cardService.updateCard(event.data, this.boardId);
      case "delete":
        this.cardService.deleteCard(event.data, this.boardId);
    }
  }

  ngOnDestroy() {}
}
