import { Observable } from "rxjs";
import { map as rxMap } from "rxjs/operators";
import { Component, Input, OnInit } from "@angular/core";
import { Card, Column, Color, Board } from "src/app/models/index";
import { ColumnService } from "src/app/services/column.service";
import { ColorService } from "src/app/services/color.service";
import { CardService } from "src/app/services/card.service";

@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
})
export class DashboardComponent implements OnInit {
  @Input() board: Board;
  public columns$: Observable<Column[]>;
  public color$: Observable<Color>;
  public cards$: Observable<Card[]>;

  constructor(
    private columnService: ColumnService,
    private cardService: CardService,
    private colorService: ColorService
  ) {}

  ngOnInit() {
    this.columns$ = this.columnService.getColumns();
    this.cards$ = this.cardService.getCards(this.board.id);
    this.color$ = this.colorService.getColor(this.board.colorId);
  }

  groupCards(columnId: string): Observable<Card[]> {
    return this.cards$.pipe(
      rxMap((cards: Card[]) => cards.filter((card) => card.colId === columnId))
    );
  }

  updateColumn(data) {
    this.columnService.updateColumn(data);
  }

  handleCardEvent(event) {
    switch (event.type) {
      case "add":
        this.cardService.addCard(event.data, this.board.id);
      case "update":
        this.cardService.updateCard(event.data, this.board.id);
      case "delete":
        this.cardService.deleteCard(event.data, this.board.id);
    }
  }
}
