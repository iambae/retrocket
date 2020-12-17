import { ColorService } from "src/app/services/color.service";
import { BoardService } from "src/app/services/board.service";
import { Observable, Subscription } from "rxjs";
import { map as rxMap } from "rxjs/operators";
import { Component, OnInit, OnDestroy } from "@angular/core";
import { Card, Column, Board, Color } from "src/app/models/index";
import { ColumnService } from "src/app/services/column.service";
import { CardService } from "src/app/services/card.service";

@Component({
  selector: "app-board",
  templateUrl: "./board.component.html",
  providers: [BoardService],
})
export class BoardComponent implements OnInit, OnDestroy {
  boardId: string;
  board$: Observable<Board>;
  color$: Observable<Color>;
  colors$: Observable<Color[]>;
  columns: Column[];
  cards: any = {};
  cardSubscription: Subscription;

  constructor(
    private boardService: BoardService,
    private cardService: CardService,
    private colorService: ColorService,
    private columnService: ColumnService
  ) {}

  ngOnInit() {
    this.boardId = window.location.pathname.split("/board/")[1];
    this.board$ = this.boardService.getBoard(this.boardId).pipe(
      rxMap((board) => {
        this.initBoard(board);
        return board;
      })
    );
  }

  initBoard(board: Board) {
    this.columns = this.columnService.getColumns().map((column, order) => ({
      ...column,
      name: board.columns[order], // Update column name from default to board's
    }));
    this.colors$ = this.colorService.colors;
    this.color$ = this.colorService.getColor(board.color);
    this.cardSubscription = this.cardService
      .getCards(this.boardId)
      .pipe(
        rxMap((cards) => {
			// Organize cards into their respective columns
          for (const column of this.columns)
            this.cards[column.order] = cards
              .filter((card: Card) => card.colId === column.order)
              .sort((a, b) => a.order - b.order);
        })
      )
      .subscribe();
  }

  /**
   * Handles EventEmitter `update` output from ColumnComponent
   * @param column column to update with new name
   */
  updateColumn(column: Column) {
    this.boardService.updateBoard(this.boardId, {
      columns: { [column.order]: column.name },
    });
  }

/**
 * Handles EventEmitter `cardEvent` output from ColumnComponent
 * @param event object with card data and type of operation: 
 * 				add, remove, delete
 */
  onCardEvent(event: { type: string; data: Card }) {
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

  ngOnDestroy() {
    if (this.cardSubscription) this.cardSubscription.unsubscribe();
  }
}
