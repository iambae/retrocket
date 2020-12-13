import { ColorService } from "src/app/services/color.service";
import { BoardService } from "src/app/services/board.service";
import { Observable, Subscription } from "rxjs";
import { map as rxMap, withLatestFrom } from "rxjs/operators";
import { Component, OnInit, OnDestroy } from "@angular/core";
import { Card, Column, Board, Color } from "src/app/models/index";
import { ColumnService } from "src/app/services/column.service";
import { CardService } from "src/app/services/card.service";
import { Router } from "@angular/router";
import { TeamService } from "src/app/services/team.service";

@Component({
  selector: "app-board",
  templateUrl: "./board.component.html",
  providers: [BoardService],
})
export class BoardComponent implements OnInit, OnDestroy {
  boardId: string;
  board$: Observable<Board>;
  cards: any = {};
  columns$: Observable<Column[]>;
  color$: Observable<Color>;
  colors$: Observable<Color[]>;

  cardSubscription: Subscription;

  constructor(
    private boardService: BoardService,
    private cardService: CardService,
    private colorService: ColorService,
    private columnService: ColumnService,
    private teamService: TeamService,
    private router: Router
  ) {}

  ngOnInit() {
    const currentUser = JSON.parse(sessionStorage.getItem("user"));
    this.boardId = window.location.pathname.split("/board/")[1];
    this.board$ = this.boardService.getBoard(this.boardId).pipe(
      withLatestFrom(this.teamService.getTeam(this.boardId)),
      rxMap(([board, team]) => {
        currentUser.uid === board.author ||
        team.members.includes(currentUser.displayName)
          ? this.initBoard(board)
          : this.router.navigate(["/join", board.id]);
        return board;
      })
    );
  }

  initBoard(board: Board) {
    this.colors$ = this.colorService.colors;
    this.color$ = this.colorService.getColor(board.color);
    this.columns$ = this.columnService.getColumns();
    this.cardSubscription = this.cardService
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

  /* TODO: Implement */
  updateColumn(event: Column) {
    console.log("BoardComponent: updateColumn: event:", event);
  }

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
